import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PaymentModalTypeEnum} from '../../core/enum/payment-modal.enum';
import {Modal} from 'bootstrap';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import moment from 'moment';
import {DashboardService} from '../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-payment-modal',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent implements OnInit, AfterViewInit {

  type: PaymentModalTypeEnum = PaymentModalTypeEnum.ADD
  @ViewChild('paymentModalSelector') paymentActionsModal!: ElementRef
  payment?: PaymentDTO = undefined
  form!: FormGroup
  protected readonly PaymentModalTypeEnum = PaymentModalTypeEnum;
  modal!: Modal
  error: string = ''
  successMessage: string = ''
  @Output() onPaymentAdded: EventEmitter<PaymentDTO> = new EventEmitter<PaymentDTO>()
  @Output() onPaymentEdited: EventEmitter<PaymentDTO> = new EventEmitter<PaymentDTO>()

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      value: new FormControl('', [Validators.required, Validators.min(0)]),
      date: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      image: new FormControl('', []),
    })
  }

  ngAfterViewInit() {
    this.paymentActionsModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm()
    })
  }

  open(payment?: PaymentDTO): void {
    this.modal = new Modal(this.paymentActionsModal.nativeElement)
    if (payment) {
      this.payment = payment
      this.form.setValue({
        username: payment?.username || '',
        title: payment?.title || '',
        value: payment?.value || 0,
        date: moment(payment.date).format('YYYY-MM-DD') || '',
        name: payment?.name || '',
        image: payment?.image || '',
      })
    }
    this.modal.show()
  }

  close(): void {
    this.resetForm()
    this.modal.hide()

  }

  handleAction(): void {
    if (this.type === PaymentModalTypeEnum.ADD) {
      this.addPayment()
      return
    }
    this.editPayment()
  }

  resetForm(): void {
    this.form.reset();
    this.payment = undefined;
    this.error = '';
    this.successMessage = '';
  }

  addPayment(): void {
    this.error = ''
    this.successMessage = ''
    const {id,...newPayment} = new PaymentDTO(this.form.value)
    newPayment.date = moment(newPayment.date).toDate()
    this.dashboardService.addPayment(newPayment)
      .subscribe({
        next: (payment: PaymentDTO) => {
          this.successMessage = 'Pagamento adicionado com sucesso'
          setTimeout(() => {
            this.onPaymentAdded.emit(payment)
            this.close()
          }, 3000)
        },
        error: (error: string) => {
          this.error = error
        }
      })
  }

  editPayment(): void {
    this.error = ''
    this.successMessage = ''
    const paymentClone = {...this.payment, ...this.form.value}
    this.dashboardService.editPayment(paymentClone)
      .subscribe({
        next: (paymentUpdated: PaymentDTO) => {
          this.successMessage = 'Pagamento editado com sucesso'
          setTimeout(() => {
            this.onPaymentEdited.emit(paymentUpdated)
            this.close()
          }, 2000)
        },
        error: (error: string) => {
          this.error = error
        }
      })
  }

}
