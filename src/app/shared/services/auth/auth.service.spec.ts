import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorageService = TestBed.inject(LocalStorageService);
    localStorageService.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when isAuthenticated is called', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return true when isAuthenticated is called', () => {
    localStorageService.setItem('user', {name: 'User'});
    expect(service.isAuthenticated()).toBeTrue();
  });

});
