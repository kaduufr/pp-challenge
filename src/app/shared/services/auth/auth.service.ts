import {Injectable} from '@angular/core';
import {UserDTO} from '../../../core/DTO/userDTO';
import {SessionStorageService} from '../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private sessionStorage: SessionStorageService) {
  }

  user: UserDTO | null = null;

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const userData = this.sessionStorage.getItem('user');
    return !!userData
  }

}
