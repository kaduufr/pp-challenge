import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {UserDTO} from '../DTO/userDTO';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
  const localStorageService: LocalStorageService = inject(LocalStorageService);
  const isAuthenticaded: boolean = localStorageService.getItem<UserDTO>('user') !== null;
  if (!isAuthenticaded) {
    const router = inject(Router)
    router.navigate(['']);
  }

  return isAuthenticaded
};
