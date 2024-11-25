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
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
}

type GetPaymentListResponseType = {
  data: TaskDTO[];
  _pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  }
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) {
  }

  getPaymentList(page: number = 1, limit: number = 10): Observable<GetPaymentListResponseType> {
    return this.apiService.get<GetTaskListResponseType>(`/tasks?_page=${page}&_per_page=${limit}`).pipe(
      map((response: GetTaskListResponseType) => {
        const tasks: TaskResponseType[] = response.data;
        const taskList: TaskDTO[] = tasks.map((task: TaskResponseType) => new TaskDTO({
            id: task.id,
            name: task.name,
            username: task.username,
            title: task.title,
            value: task.value,
            date: new Date(task.date),
            image: task.image,
            isPayed: task.isPayed
        }))
        return {
          data: taskList,
          _pagination: {
            currentPage: response?.first || 1,
            totalItems: response?.items || 0,
            totalPages: response?.pages || 0
          }
        }
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
