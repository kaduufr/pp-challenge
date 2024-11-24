import {Component, ViewChild} from '@angular/core';
import {TopBarComponent} from '../../shared/top-bar/top-bar.component';
import {DashboardService} from './dashboard.service';
import {NgForOf} from '@angular/common';
import {TaskDTO} from '../../core/DTO/taskDTO';
import {TaskModalComponent} from '../../shared/task-modal/task-modal.component';
import {TaskModalTypeEnum} from '../../shared/task-modal/task-modal.enum';
import {DeletePaymentModalComponent} from '../../shared/delete-payment-modal/delete-payment-modal.component';

@Component({
  selector: 'app-dashboard',
  imports: [TopBarComponent, NgForOf, TaskModalComponent, DeletePaymentModalComponent],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private isLoading: boolean = false
  error: string = '';
  taskList: TaskDTO[] = [];
  @ViewChild("taskModalSelector") taskModal!: TaskModalComponent
  @ViewChild("deletePaymentModalSelector") deletePaymentModal!: DeletePaymentModalComponent

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.isLoading = true
    this.dashboardService.getTaskList().subscribe({
      next: (tasks) => {
        this.taskList = tasks
      },
      error: (error) => {
        console.error(error)
        this.error = 'Erro ao carregar tarefas'
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  openModalHandleTask( type: TaskModalTypeEnum = TaskModalTypeEnum.ADD, task?: TaskDTO): void {
    this.taskModal.type = type
    if (type === TaskModalTypeEnum.ADD) {
      this.taskModal.open()
      return
    }
    this.taskModal.open(task)
  }

  openModalDeleteTask(task: TaskDTO): void {
    this.deletePaymentModal.open(task)
  }

  deleteTask(taskId: number) {
    this.dashboardService.deleteTask(taskId).subscribe({
      next: () => {
        this.dashboardService.getTaskList().subscribe({
          next: (tasks: TaskDTO[]) => {
            this.taskList = tasks
          },
          error: (error) => {
            console.error(error)
            this.error = 'Erro ao carregar tarefas'
          }
        })
      },
      error: (error) => {
        console.error(error)
        this.error = 'Erro ao deletar tarefa'
      }
    })
  }

  protected readonly TaskModalTypeEnum = TaskModalTypeEnum;
}
