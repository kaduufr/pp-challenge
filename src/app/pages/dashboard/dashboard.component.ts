import {Component, OnInit, ViewChild} from '@angular/core';
import {TopBarComponent} from '../../shared/top-bar/top-bar.component';
import {DashboardService} from '../../core/services/dashboard/dashboard.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {PaymentModalComponent} from '../../shared/payment-modal/payment-modal.component';
import {PaymentModalTypeEnum} from '../../core/enum/payment-modal.enum';
import {DeletePaymentModalComponent} from '../../shared/delete-payment-modal/delete-payment-modal.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import moment from 'moment';
import {PaginatorComponent} from '../../shared/paginator/paginator.component';
import {SortStateType} from '../../shared/interfaces/sort-state.type';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {GetPaymentListResponseType} from '../../shared/interfaces/get-payment-list-response.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [
    TopBarComponent,
    NgForOf,
    PaymentModalComponent,
    DeletePaymentModalComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CurrencyPipe,
    PaginatorComponent
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  protected readonly PaymentModalTypeEnum = PaymentModalTypeEnum;
  protected readonly moment = moment;
  error: string = '';
  paymentList: PaymentDTO[] = [];
  rowsNumber: number[] = [10, 15, 20, 25, 30];
  @ViewChild("paymentModalSelector") paymentModal!: PaymentModalComponent
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
    this.getPaymentList(this.pagination.currentPage)
    this.searchForm = new FormGroup({
      username: new FormControl('')
    })
  }

  get username(): string {
    return this.searchForm.get('username')?.value
  }

  getPaymentList(page: number = 1): void {
    this.dashboardService.getPaymentList(page, this.pagination.itemsPerPage)
      .subscribe({
        next: (response: GetPaymentListResponseType) => {
          this.paymentList = response.data
          this.pagination = {
            currentPage: page,
            totalItems: response._pagination.totalItems,
            totalPages: response._pagination.totalPages,
            itemsPerPage: this.pagination.itemsPerPage
          }
        },
        error: (_error) => {
          this.error = 'Erro ao carregar pagamentos'
        }
      })
  }

  openModalHandlePayment(type: PaymentModalTypeEnum = PaymentModalTypeEnum.ADD, payment?: PaymentDTO): void {
    this.paymentModal.type = type
    if (type === PaymentModalTypeEnum.ADD) {
      this.paymentModal.open()
      return
    }
    this.paymentModal.open(payment)
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
        next: (payments: PaymentDTO[]) => {
          this.paymentList = payments
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
    this.getPaymentList(this.pagination.currentPage)
  }

  onCheckPaymentChange(payment: PaymentDTO) {
    this.dashboardService.updatePaymentStatus(payment)
      .subscribe({
        next: () => {
          payment.isPayed = !payment.isPayed
        },
        error: (_error: HttpErrorResponse) => {
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
    this.paymentList = this.utilityService.sort(this.paymentList, property, isAsc, isDate)
  }

  handleDeletePaymentEvent(_payment: PaymentDTO) {
    this.getPaymentList(this.pagination.currentPage)
  }

  changePage(page: number) {
    this.getPaymentList(page)
  }

  changeItemsPerPage(event: Event) {
    this.pagination.itemsPerPage = Number((event.target as HTMLSelectElement).value)
    this.getPaymentList(this.pagination.currentPage)
  }

  handlePaymentEdited(payment: PaymentDTO) {
    this.paymentList = this.paymentList.map((item: PaymentDTO): PaymentDTO => {
      if (item.id === payment.id) {
        return payment
      }
      return item
    })
  }
}
