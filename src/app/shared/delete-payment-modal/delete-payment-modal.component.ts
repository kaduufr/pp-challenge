import {Component, ElementRef, ViewChild} from '@angular/core';
import {TaskDTO} from '../../core/DTO/taskDTO';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Modal} from 'bootstrap';
import {DashboardService} from '../../pages/dashboard/dashboard.service';

@Component({
  selector: 'app-delete-payment-modal',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './delete-payment-modal.component.html',
  styleUrl: './delete-payment-modal.component.scss'
})
export class DeletePaymentModalComponent {

  data!: TaskDTO;
  @ViewChild('deletePaymentModalSelector') deletePaymentModal!: ElementRef;
  modal!: Modal

  constructor(private dashboardService: DashboardService) {
  }

  open(taskSelected: TaskDTO): void {
    this.data = taskSelected;
    this.modal = new Modal(this.deletePaymentModal.nativeElement);
    this.modal.show();
  }

  close(): void {
    this.modal.hide();
  }

  deletePayment(dataId: number): void {
    this.dashboardService.deleteTask(dataId)
  }
}
