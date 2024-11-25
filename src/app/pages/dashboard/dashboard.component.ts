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

type SortStateType = {
  username: boolean;
  title: boolean;
  date: boolean;
  value: boolean;
  isPayed: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [TopBarComponent, NgForOf, TaskModalComponent, DeletePaymentModalComponent, FormsModule, ReactiveFormsModule, LoadingComponent, NgIf, CurrencyPipe],
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
  @ViewChild("taskModalSelector") taskModal!: TaskModalComponent
  @ViewChild("deletePaymentModalSelector") deletePaymentModal!: DeletePaymentModalComponent
  searchForm!: FormGroup
  filterApplied: boolean = false;
  private pagination: TaskDTO[] = [];
  sortState: SortStateType = {
    username: false,
    title: false,
    date: false,
    value: false,
    isPayed: false,
  };
  actualPage: number = 1;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.getTaskList(this.actualPage)
    this.searchForm = new FormGroup({
      username: new FormControl('')
    })
  }

  get username(): string {
    return this.searchForm.get('username')?.value
  }

  getTaskList(page: number = 1): void {
    this.isLoading = true
    this.dashboardService.getPaymentList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (tasks) => {
          this.taskList = tasks
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
    this.getTaskList(this.actualPage)
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

    const ordering = (a: TaskDTO, b: TaskDTO) =>
      isDate
        ? new Date(a[property] as string).getTime() -
        new Date(b[property] as string).getTime()
        : a[property] > b[property]
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
    this.getTaskList(this.actualPage)
  }

}
