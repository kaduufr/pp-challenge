import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() {
  }

  sort<T = any>(array: T[], key: string, order: 'asc' | 'desc' = 'asc', isDate: boolean = false): T[] {
    const ordering = (first: T, next: T) => {
      if (isDate) {
        //@ts-ignore
        return moment(first[key]).isAfter(next[key]) ? 1 : -1;
      }

      //@ts-ignore
      return first[key] as keyof T> next[key] ? 1 : -1;

    }

    return array.sort((a: T, b: T) => order === 'asc' ? ordering(a, b) : ordering(b, a));
  }
}
