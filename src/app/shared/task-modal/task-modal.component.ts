import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TaskModalTypeEnum} from './task-modal.enum';
import {Modal} from 'bootstrap';
import {PaymentDTO} from '../../core/DTO/paymentDTO';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import moment from 'moment';
import {DashboardService} from '../services/dashboard/dashboard.service';
import {LoadingComponent} from '../loading/loading.component';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-task-modal',
  imports: [
    ReactiveFormsModule,
    NgIf,
    LoadingComponent
  ],
  standalone: true,
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent implements OnInit, AfterViewInit {

  type: TaskModalTypeEnum = TaskModalTypeEnum.ADD
  @ViewChild('taskModalSelector') taskModalActionsModal!: ElementRef
  task?: PaymentDTO = undefined
  form!: FormGroup
  protected readonly TaskModalTypeEnum = TaskModalTypeEnum;
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
    this.taskModalActionsModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm()
    })
  }

  open(task?: PaymentDTO): void {
    this.modal = new Modal(this.taskModalActionsModal.nativeElement)
    if (task) {
      this.task = task
      this.form.setValue({
        username: task?.username || '',
        title: task?.title || '',
        value: task?.value || 0,
        date: moment(task.date).format('YYYY-MM-DD') || '',
        name: task?.name || '',
        image: task?.image || '',
      })
    }
    this.modal.show()
  }

  close(): void {
    this.resetForm()
    this.modal.hide()

  }

  handleAction(): void {
    if (this.type === TaskModalTypeEnum.ADD) {
      this.addTask()
      return
    }
    this.editTask()
  }

  resetForm(): void {
    this.form.reset();
    this.task = undefined;
    this.error = '';
    this.successMessage = '';
  }

  addTask(): void {
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

  editTask(): void {
    this.error = ''
    this.successMessage = ''
    const paymentClone = {...this.task, ...this.form.value}
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
