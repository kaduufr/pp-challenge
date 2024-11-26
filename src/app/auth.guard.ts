import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {SessionStorageService} from './shared/services/session-storage/session-storage.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
  const sessionStorageService: SessionStorageService = inject(SessionStorageService);
  const isAuthenticaded: boolean = sessionStorageService.getItem('user') !== null;
  if (!isAuthenticaded) {
    const router = inject(Router)
    router.navigate(['']);
  }

  return isAuthenticaded
};
