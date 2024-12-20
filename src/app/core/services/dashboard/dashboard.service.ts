import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {PaymentDTO} from '../../DTO/paymentDTO';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GetTaskListResponseType} from '../../../shared/interfaces/get-task-list-response.type';
import {GetPaymentListResponseType} from '../../../shared/interfaces/get-payment-list-response.type';
import {PaymentResponseType} from '../../../shared/interfaces/payment-response.type';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) {
  }

  getPaymentList(page: number = 1, limit: number = 10): Observable<GetPaymentListResponseType> {
    return this.httpClient.get<GetTaskListResponseType>(`/tasks?_page=${page}&_per_page=${limit}`).pipe(
      map((response: GetTaskListResponseType) => {
        const payments: PaymentResponseType[] = response.data;
        const paymentList: PaymentDTO[] = payments.map((payment: PaymentResponseType) => new PaymentDTO({
            ...payment,
            date: new Date(payment.date),
        }))
        return {
          data: paymentList,
          _pagination: {
            currentPage: response?.first || 1,
            totalItems: response?.items || 0,
            totalPages: response?.pages || 0
          }
        }
      }));
  }

  deletePayment(id: number): Observable<null> {
    return this.httpClient.delete<null>(`/tasks/${id}`);
  }

  getPaymentByUsername(username: string): Observable<PaymentDTO[]> {
    return this.httpClient.get<PaymentDTO[]>(`/tasks?username=${username}`).pipe(
      map((payments: PaymentDTO[]) => {
          return payments.map((payment: PaymentDTO) => {
              return {
                ...payment,
                date: new Date(payment.date),
              }
            }
          )
        }
      )
    )
  }

  updatePaymentStatus(payment: PaymentDTO): Observable<PaymentDTO> {
    const paymentUpdated = Object.assign({}, payment, {isPayed: !payment.isPayed});
    return this.httpClient.put<PaymentDTO>(`/tasks/${paymentUpdated.id}`, paymentUpdated);
  }

  editPayment(payment: PaymentDTO): Observable<PaymentDTO> {
    return this.httpClient.put<PaymentDTO>(`/tasks/${payment.id}`, payment)
      .pipe(
        catchError((_error: HttpErrorResponse) => {
          const statusCode = _error.status;
          return throwError(`E${statusCode}: Erro ao editar pagamento`);
        })
      )
  }

  addPayment(payment: Omit<PaymentDTO, 'id'>): Observable<PaymentDTO> {
    return this.httpClient.post<PaymentDTO>('/tasks', payment)
      .pipe(
        catchError((_error: HttpErrorResponse) => {
          const statusCode = _error.status;
          return throwError(`E${statusCode}: Erro ao adicionar pagamento`);
        })
      )
  }
}
