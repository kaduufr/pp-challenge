import moment from 'moment';

export class PaymentDTO {
  id: number = -1;
  name: string = '';
  username: string = '';
  title: string = '';
  value: number = 0;
  date: Date = moment().toDate();
  image: string = '';
  isPayed: boolean = false;

  constructor(data?: Partial<PaymentDTO>) {
    Object.assign<PaymentDTO, Partial<PaymentDTO> | undefined>(this, data);
  }
}
