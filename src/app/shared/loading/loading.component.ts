import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  @Input() size: string | number = 2;
  constructor() {}

}
