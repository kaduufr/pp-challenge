import {Injectable} from '@angular/core';

export interface IUser {
  email: string;
  name: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: IUser | null = null;

  constructor() {
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const userData = sessionStorage.getItem('user');
    return !!userData
  }

}
