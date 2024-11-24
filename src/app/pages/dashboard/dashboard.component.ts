import { Component } from '@angular/core';
import {TopBarComponent} from '../../shared/top-bar/top-bar.component';
import {DashboardService} from './dashboard.service';
import {ITask} from '../../shared/interfaces/task';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [TopBarComponent, NgForOf],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private isLoading: boolean = false
  error: string = '';
  taskList: ITask[] = [];

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
}
