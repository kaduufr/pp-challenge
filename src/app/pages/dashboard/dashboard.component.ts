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
  taskListCopy: TaskDTO[] = [];
  @ViewChild("taskModalSelector") taskModal!: TaskModalComponent
  @ViewChild("deletePaymentModalSelector") deletePaymentModal!: DeletePaymentModalComponent
  searchForm!: FormGroup

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.getTaskList()
    this.searchForm = new FormGroup({
      username: new FormControl('')
    })
  }

  getTaskList(): void {
    this.isLoading = true
    this.dashboardService.getPaymentList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (tasks) => {
          this.taskList = tasks
          this.taskListCopy = tasks
        },
        error: (error) => {
          console.error(error)
          this.error = 'Erro ao carregar pagamentos'
        }
      })
  }

  get username(): string {
    return this.searchForm.get('username')?.value
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
      this.getTaskList()
      return
    }
    this.dashboardService.getPaymentByUsername(username)
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

  // todo: Trocar o icone pra um botão de limpar
  clearSearch() {
    this.searchForm.reset()
    this.taskList = this.taskListCopy
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

}
