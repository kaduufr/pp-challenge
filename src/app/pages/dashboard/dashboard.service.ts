import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api/api.service';
import {map, Observable} from 'rxjs';
import {ITask} from '../../shared/interfaces/task';


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

}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) {
  }

  getTaskList(page: number = 1): Observable<ITask[]> {
    return this.apiService.get<TaskResponseType[]>(`/tasks?_page=${page}`).pipe(
      map((tasks) => {
        const taskList: ITask[] = tasks.map((task) => {
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
}
