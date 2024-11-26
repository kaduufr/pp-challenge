import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {}

  setItem<T = any>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      sessionStorage?.setItem(key, JSON.stringify(value));
      return true;
    }
    catch (_error) {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : null;
    }
    catch (_error) {
      return null;
    }
  }

  clear(): void {
    sessionStorage.clear();
  }

}
