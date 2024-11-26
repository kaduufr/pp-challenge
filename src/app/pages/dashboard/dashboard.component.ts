import {Component, OnInit, ViewChild} from '@angular/core';
import {TopBarComponent} from '../../shared/top-bar/top-bar.component';
import {DashboardService} from '../../shared/services/dashboard/dashboard.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {TaskModalComponent} from '../../shared/task-modal/task-modal.component';
import {TaskModalTypeEnum} from '../../shared/task-modal/task-modal.enum';
import {DeletePaymentModalComponent} from '../../shared/delete-payment-modal/delete-payment-modal.component';
import {finalize} from 'rxjs';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingComponent} from '../../shared/loading/loading.component';
import moment from 'moment';
import {PaginatorComponent} from '../../shared/paginator/paginator.component';
import {SortStateType} from '../../shared/interfaces/sort-state.type';
import {UtilityService} from '../../shared/services/utility/utility.service';

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
export class DashboardComponent implements OnInit {

  protected readonly TaskModalTypeEnum = TaskModalTypeEnum;
  protected readonly moment = moment;
  error: string = '';
  taskList: PaymentDTO[] = [];
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

  constructor(private dashboardService: DashboardService, private utilityService: UtilityService) {
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
    this.dashboardService.getPaymentList(page, this.pagination.itemsPerPage)
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

  openModalHandlePayment(type: TaskModalTypeEnum = TaskModalTypeEnum.ADD, task?: PaymentDTO): void {
    this.taskModal.type = type
    if (type === TaskModalTypeEnum.ADD) {
      this.taskModal.open()
      return
    }
    this.taskModal.open(task)
  }

  openModalDeletePayment(payment: PaymentDTO): void {
    this.deletePaymentModal.open(payment)
  }

  searchPayment(username: string) {
    if (!username || username === '') {
      this.clearSearch()
    }
    this.dashboardService.getPaymentByUsername(username)
      .subscribe({
        next: (tasks) => {
          this.taskList = tasks
          this.filterApplied = true
        },
        error: (_error) => {
          this.error = 'Erro ao carregar pagamentos'
        }
      })
  }

  clearSearch() {
    this.searchForm.reset()
    this.filterApplied = false
    this.getTaskList(this.pagination.currentPage)
  }

  onCheckPaymentChange(event: Event, payment: PaymentDTO) {
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

  organizer(property: keyof SortStateType) {
    this.sortState = Object.assign({}, this.sortState, {
      [property]: !this.sortState[property]
    })
    const isAsc: "asc" | "desc" = this.sortState[property] ? "asc" : "desc"
    const isDate = property !== 'date'
    this.taskList = this.utilityService.sort(this.taskList, property, isAsc, isDate)
  }

  handleDeletePaymentEvent(_payment: PaymentDTO) {
    this.getTaskList(this.pagination.currentPage)
  }

  changePage(page: number) {
    this.getTaskList(page)
  }

  changeItemsPerPage(event: Event) {
    this.pagination.itemsPerPage = Number((event.target as HTMLSelectElement).value)
    this.getTaskList(this.pagination.currentPage)
  }

  handlePaymentEdited(payment: PaymentDTO) {
    this.taskList = this.taskList.map((task: PaymentDTO): PaymentDTO => {
      if (task.id === payment.id) {
        return payment
      }
      return task
    })
  }
}
