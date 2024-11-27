import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import {LoginService} from '../../../../shared/services/login/login.service';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['setItem']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginFormComponent],
      declarations: [],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.valid).toBeFalsy();
  });

  it('should display error message if form is invalid and submit is clicked', () => {
    component.submit();
    fixture.detectChanges();
    expect(component.error).toBe('Preencha os campos corretamente');
  });

  it('should call login service on submit with valid credentials', () => {
    const loginData = { email: 'test@example.com', password: '123456' };
    component.form.setValue(loginData);
    loginService.login.and.returnValue(of({ email: 'test@example.com', id: 1, name: "teste", password: "senhateste" }));

    component.submit();
    fixture.detectChanges();

    expect(loginService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(localStorageService.setItem).toHaveBeenCalledWith('user', 'test@example.com');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle error after login', () => {
    const loginData = { email: 'test@example.com', password: '123456' };
    component.form.setValue(loginData);
    loginService.login.and.returnValue(throwError({ message: 'Erro ao fazer login' }));

    component.submit();
    fixture.detectChanges();

    expect(component.error).toBe('Erro ao realizar login');
  });

  it('should navigate to dashboard if user is already authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();

    component.togglePassword();
    fixture.detectChanges();

    expect(component.showPassword).toBeTruthy();
  });

  it('should show error message on form', () => {
    const emailControl = component.form.get('email');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(component.getErrorMessage('email')).toBe('Este campo é obrigatório');
    expect(component.getErrorMessage('password')).toBe('Este campo é obrigatório');

    emailControl?.setValue('invalid');
    passwordControl?.setValue('123');
    expect(component.getErrorMessage('email')).toBe('Email inválido');
    expect(component.getErrorMessage('password')).toBe('A senha precisa ter no mínimo 6 caracteres.');
  });
});
