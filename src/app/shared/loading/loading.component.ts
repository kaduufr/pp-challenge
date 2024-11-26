import {Component, Input, OnInit} from '@angular/core';
import {LoadingService} from '../services/loading/loading.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [
    NgIf,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit {

  @Input() size: string | number = 2;
  show: Observable<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.show = this.loadingService.isLoading;
  }

}
