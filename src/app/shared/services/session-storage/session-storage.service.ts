import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {}

  setItem<T = any>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    catch (error) {
      console.error('Error saving to sessionStorage', error);
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
