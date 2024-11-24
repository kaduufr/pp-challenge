export class TaskDTO {
  id: number = -1
  name: string = '';
  username: string = '';
  title: string = '';
  value: number = 0;
  date: Date = new Date();
  image: string = '';
  isPayed: boolean = false;

  constructor() {}
}
