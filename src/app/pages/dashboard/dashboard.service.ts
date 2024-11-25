import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api/api.service';
import {map, Observable} from 'rxjs';
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

  getPaymentList(page: number = 1): Observable<TaskDTO[]> {
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

  deletePayment(id: number): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${id}`);
  }

  getPaymentByUsername(username: string): Observable<TaskDTO[]> {
    return this.apiService.get<TaskDTO[]>(`/tasks?username=${username}`).pipe(
      map((tasks: TaskDTO[]) => {
          return tasks.map((task: TaskDTO) => {
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
            }
          )
        }
      )
    )
  }

  updatePaymentStatus(payment: TaskDTO): Observable<TaskDTO> {
    const paymentUpdated = Object.assign({}, payment, {isPayed: !payment.isPayed});
    return this.apiService.put<TaskDTO>(`/tasks/${paymentUpdated.id}`, paymentUpdated);
  }
}
