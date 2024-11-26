import {TaskResponseType} from './task-response.type';

export type GetTaskListResponseType = {
  data: TaskResponseType[];
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
}
