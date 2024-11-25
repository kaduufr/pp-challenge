import {Component, ViewChild} from '@angular/core';
import {TopBarComponent} from '../../shared/top-bar/top-bar.component';
import {DashboardService} from './dashboard.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {TaskDTO} from '../../core/DTO/taskDTO';
import {TaskModalComponent} from '../../shared/task-modal/task-modal.component';
import {TaskModalTypeEnum} from '../../shared/task-modal/task-modal.enum';
import {DeletePaymentModalComponent} from '../../shared/delete-payment-modal/delete-payment-modal.component';
import {finalize} from 'rxjs';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingComponent} from '../../shared/loading/loading.component';
import moment from 'moment';
import {PaginatorComponent} from '../../shared/paginator/paginator.component';

type SortStateType = {
  username: boolean;
  title: boolean;
  date: boolean;
  value: boolean;
  isPayed: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    TopBarComponent,
    NgForOf,
    TaskModalComponent,
    DeletePaymentModalComponent,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    NgIf,
    CurrencyPipe,
    PaginatorComponent
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  protected isLoading: boolean = false
  protected readonly TaskModalTypeEnum = TaskModalTypeEnum;
  protected readonly moment = moment;
  error: string = '';
  taskList: TaskDTO[] = [];
  rowsNumber: number[] = [10, 15, 20, 25, 30];
  @ViewChild("taskModalSelector") taskModal!: TaskModalComponent
  @ViewChild("deletePaymentModalSelector") deletePaymentModal!: DeletePaymentModalComponent
  searchForm!: FormGroup
  filterApplied: boolean = false;
  sortState: SortStateType = {
    username: false,
    title: false,
    date: false,
    value: false,
    isPayed: false,
  };
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  }

  constructor(private dashboardService: DashboardService) {
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.rowsNumber[0]
    }
  }

  ngOnInit() {
    this.getTaskList(this.pagination.currentPage)
    this.searchForm = new FormGroup({
      username: new FormControl('')
    })
  }

  get username(): string {
    return this.searchForm.get('username')?.value
  }

  getTaskList(page: number = 1): void {
    this.isLoading = true
    this.dashboardService.getPaymentList(page, this.pagination.itemsPerPage)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.taskList = response.data
          this.pagination = {
            currentPage: page,
            totalItems: response._pagination.totalItems,
            totalPages: response._pagination.totalPages,
            itemsPerPage: this.pagination.itemsPerPage
          }
        },
        error: (error) => {
          console.error(error)
          this.error = 'Erro ao carregar pagamentos'
        }
      })
  }

  openModalHandlePayment(type: TaskModalTypeEnum = TaskModalTypeEnum.ADD, task?: TaskDTO): void {
    this.taskModal.type = type
    if (type === TaskModalTypeEnum.ADD) {
      this.taskModal.open()
      return
    }
    this.taskModal.open(task)
  }

  openModalDeletePayment(payment: TaskDTO): void {
    this.deletePaymentModal.open(payment)
  }

  searchPayment(username: string) {
    this.isLoading = true
    if (!username || username === '') {
      this.clearSearch()
    }
    this.dashboardService.getPaymentByUsername(username)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (tasks) => {
          this.taskList = tasks
          this.filterApplied = true
        },
        error: (error) => {
          console.error(error)
          this.error = 'Erro ao carregar pagamentos'
        }
      })
  }

  clearSearch() {
    this.searchForm.reset()
    this.filterApplied = false
    this.getTaskList(this.pagination.currentPage)
  }

  onCheckPaymentChange(event: Event, payment: TaskDTO) {
    const checkbox = event.target as HTMLInputElement
    this.dashboardService.updatePaymentStatus(payment)
      .subscribe({
        next: () => {
          payment.isPayed = !payment.isPayed
        },
        error: (error) => {
          console.error(error)
          this.error = 'Erro ao atualizar pagamento'
        }
      })
  }

  sortingPage = (property: keyof SortStateType, isDate: boolean = false): TaskDTO[] => {
    this.sortState = Object.assign({}, this.sortState, {
      [property]: !this.sortState[property]
    })

    const ordering = (first: TaskDTO, next: TaskDTO) =>
      isDate
        ? new Date(first[property] as string).getTime() -
        new Date(next[property] as string).getTime()
        : first[property] > next[property]
          ? 1
          : -1;


    return this.taskList.sort(
      this.sortState[property] ?
        ordering : (a, b) => ordering(a, b)
    );
  }

  organizer(property: keyof SortStateType) {
    if (property !== 'date') {
      this.taskList = this.sortingPage(property);
      return
    }
    this.taskList = this.sortingPage(property, true);
  }

  handleDeletePaymentEvent(_payment: TaskDTO) {
    this.getTaskList(this.pagination.currentPage)
  }

  changePage(page: number) {
    this.getTaskList(page)
    console.log(this.pagination)
  }

  changeItemsPerPage(event: Event) {
    this.pagination.itemsPerPage = parseInt((event.target as HTMLSelectElement).value, 10)
    this.getTaskList(this.pagination.currentPage)
  }
}
