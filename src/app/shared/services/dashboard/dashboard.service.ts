import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {TaskDTO} from '../../../core/DTO/taskDTO';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GetTaskListResponseType} from '../../interfaces/get-task-list-response.type';
import {GetPaymentListResponseType} from '../../interfaces/get-payment-list-response.type';
import {TaskResponseType} from '../../interfaces/task-response.type';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) {
  }

  getPaymentList(page: number = 1, limit: number = 10): Observable<GetPaymentListResponseType> {
    return this.httpClient.get<GetTaskListResponseType>(`/tasks?_page=${page}&_per_page=${limit}`).pipe(
      map((response: GetTaskListResponseType) => {
        const tasks: TaskResponseType[] = response.data;
        const taskList: TaskDTO[] = tasks.map((task: TaskResponseType) => new TaskDTO({
            ...task,
            date: new Date(task.date),
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
    return this.httpClient.delete<void>(`/tasks/${id}`);
  }

  getPaymentByUsername(username: string): Observable<TaskDTO[]> {
    return this.httpClient.get<TaskDTO[]>(`/tasks?username=${username}`).pipe(
      map((tasks: TaskDTO[]) => {
          return tasks.map((task: TaskDTO) => {
              return {
                ...task,
                date: new Date(task.date),
              }
            }
          )
        }
      )
    )
  }

  updatePaymentStatus(payment: TaskDTO): Observable<TaskDTO> {
    const paymentUpdated = Object.assign({}, payment, {isPayed: !payment.isPayed});
    return this.httpClient.put<TaskDTO>(`/tasks/${paymentUpdated.id}`, paymentUpdated);
  }

  editPayment(payment: TaskDTO): Observable<TaskDTO> {
    return this.httpClient.put<TaskDTO>(`/tasks/${payment.id}`, payment)
      .pipe(
        catchError((_error: HttpErrorResponse) => {
          const statusCode = _error.status;
          return throwError(`E${statusCode}: Erro ao editar pagamento`);
        })
      )
  }

  addPayment(payment: Omit<TaskDTO, 'id'>): Observable<TaskDTO> {
    return this.httpClient.post<TaskDTO>('/tasks', payment)
      .pipe(
        catchError((_error: HttpErrorResponse) => {
          const statusCode = _error.status;
          return throwError(`E${statusCode}: Erro ao adicionar pagamento`);
        })
      )
  }
}
