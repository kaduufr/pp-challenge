import {Component, ElementRef, ViewChild} from '@angular/core';
import {TaskModalTypeEnum} from './task-modal.enum';
import {Modal} from 'bootstrap';
import {TaskDTO} from '../../core/DTO/taskDTO';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-task-modal',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {

  type: TaskModalTypeEnum = TaskModalTypeEnum.ADD
  @ViewChild('taskModalSelector') taskModalActionsModal!: ElementRef
  task?: TaskDTO = undefined
  form!: FormGroup
  protected readonly TaskModalTypeEnum = TaskModalTypeEnum;
  modal!: Modal

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      value: new FormControl('', [Validators.required, Validators.min(0)]),
      date: new FormControl('', [Validators.required]),
    })
  }

  ngOnViewInit() {
    this.taskModalActionsModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.form.reset()
      this.task = undefined
    })
  }

  open(task?: TaskDTO): void {
    this.modal = new Modal(this.taskModalActionsModal.nativeElement)
    if (task) {
      this.task = task
      this.form.setValue({
        username: task.username || '',
        title: task.title || '',
        value: task.value || 0,
        date: moment(task.date).format('YYYY-MM-DD') || ''
      })
    }
    this.modal.show()
  }

  close(): void {
    console.log('Close')
    this.form.reset()
    this.task = undefined
    this.modal.hide()
  }

  handleAction(): void {
    if (this.type === TaskModalTypeEnum.ADD) {
      this.addTask()
      return
    }
    this.editTask()
  }

  addTask(): void {
    // Add task logic
  }

  editTask(): void {
    // Edit task logic
  }

  ngOnDestroy() {
    console.log('Destroy')
    this.modal.dispose()
  }

}
