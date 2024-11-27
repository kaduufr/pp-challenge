import {Injectable} from '@angular/core';
import {UserDTO} from '../../../core/DTO/userDTO';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorageService: LocalStorageService) {
  }

  user: UserDTO | null = null;

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const userData = this.localStorageService.getItem<UserDTO>('user');
    return !!userData
  }

}
