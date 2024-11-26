import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading: BehaviorSubject<boolean>  = new BehaviorSubject(false);
  constructor() { }

  emitLoading(loading: boolean): void {
    this.isLoading.next(loading);
  }
}
