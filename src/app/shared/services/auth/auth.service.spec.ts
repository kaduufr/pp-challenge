import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {SessionStorageService} from '../session-storage/session-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let sessionStorageService: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    sessionStorageService = TestBed.inject(SessionStorageService);
    sessionStorageService.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when isAuthenticated is called', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return true when isAuthenticated is called', () => {
    sessionStorageService.setItem('user', {name: 'User'});
    expect(service.isAuthenticated()).toBeTrue();
  });

});
