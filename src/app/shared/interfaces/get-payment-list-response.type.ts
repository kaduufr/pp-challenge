import {PaymentDTO} from '../../core/DTO/paymentDTO';

export type GetPaymentListResponseType = {
  data: PaymentDTO[];
  _pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  }
}
