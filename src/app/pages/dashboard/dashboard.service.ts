import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api/api.service';
import {map, Observable} from 'rxjs';
import {ITask} from '../../shared/interfaces/task';
import {TaskDTO} from '../../core/DTO/taskDTO';

type TaskResponseType = {
  id: number;
  name: string
  username: string;
  title: string;
  value: number;
  date: string;
  image: string;
  isPayed: boolean;
}

type GetTaskListResponseType = {
  data: TaskResponseType[];
  total: number;
  first: number;
  prev: number;
  last: number;
  pages: number;
  items: number;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) {
  }

  getTaskList(page: number = 1): Observable<TaskDTO[]> {
    return this.apiService.get<GetTaskListResponseType>(`/tasks?_page=${page}`).pipe(
      map((response: GetTaskListResponseType) => {
        const tasks: TaskResponseType[] = response.data;
        const taskList: TaskDTO[] = tasks.map((task: TaskResponseType) => {
          return {
            id: task.id,
            name: task.name,
            username: task.username,
            title: task.title,
            value: task.value,
            date: new Date(task.date),
            image: task.image,
            isPayed: task.isPayed
          }
        })
        return taskList
      }));
  }

  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${id}`);
  }
}