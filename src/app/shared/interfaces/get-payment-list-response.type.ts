import {TaskDTO} from '../../core/DTO/taskDTO';

export type GetPaymentListResponseType = {
  data: TaskDTO[];
  _pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  }
}
