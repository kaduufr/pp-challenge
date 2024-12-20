import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {Modal} from 'bootstrap';
import {DashboardService} from '../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-delete-payment-modal',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './delete-payment-modal.component.html',
  styleUrl: './delete-payment-modal.component.scss'
})
export class DeletePaymentModalComponent {

  data!: PaymentDTO;
  @ViewChild('deletePaymentModalSelector') deletePaymentModal!: ElementRef;
  modal!: Modal
  @Output() deletePaymentEvent = new EventEmitter<PaymentDTO>();
  error: string = '';

  constructor(private dashboardService: DashboardService) {
  }

  open(paymentSelected: PaymentDTO): void {
    this.data = paymentSelected;
    this.modal = new Modal(this.deletePaymentModal.nativeElement);
    this.modal.show();
  }

  close(): void {
    this.modal.hide();
  }

  deletePayment(data: PaymentDTO): void {
    this.dashboardService.deletePayment(data.id)
      .subscribe({
        next: () => {
          this.deletePaymentEvent.emit(data);
          this.close();
        },
        error: (_error) => {
          this.error = 'Erro ao deletar pagamento';
        }
      })
  }
}
