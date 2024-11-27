import {PaymentResponseType} from './payment-response.type';

export type GetTaskListResponseType = {
  data: PaymentResponseType[];
  first: number;
  prev?: number;
  next?: number;
  last?: number;
  pages: number;
  items: number;
}
