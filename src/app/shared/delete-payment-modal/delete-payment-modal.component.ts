import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-payment-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-payment-modal.component.html',
  styleUrl: './delete-payment-modal.component.scss'
})
export class DeletePaymentModalComponent {

  constructor() {
  }

  open(): void {
    // Open modal logic
  }

  close(): void {
    // Close modal logic
  }

  deletePayment(): void {
    // Delete payment logic
  }
}
