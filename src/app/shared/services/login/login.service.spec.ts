import {TestBed} from '@angular/core/testing';

import {LoginService} from './login.service';
import {HttpClient, HttpErrorResponse, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing';
import {UserResponseType} from '../../interfaces/user-response.type';
import {LoginDTO} from '../../../core/DTO/loginDTO';
import {of} from 'rxjs';

describe('LoginService', () => {
  let service: LoginService;
  let httpClient: HttpClient
  let httpMock: HttpTestingController

  const userMock: UserResponseType = {
    id: 1,
    name: 'Teste',
    email: 'teste@gmail.com',
    password: 'senhateste'
  }

  const user: LoginDTO = {
    email: 'teste@gmail.com',
    password: 'senhateste'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LoginService);
    httpClient = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user if success', () => {

    service.login(user.email, user.password).subscribe({
      next: (response) => {
        expect(response).toEqual(userMock)
      }
    })

    const req: TestRequest = httpMock.expectOne('/account?email=' + user.email)
    expect(req.request.method).toBe('GET')
    spyOn(service, 'findUserByEmail').and.returnValue(of(userMock))
  });

  it('should return error on request', () => {

    service.login(user.email, user.password).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Erro ao realizar login')
      }
    })

    const req: TestRequest = httpMock.expectOne('/account?email=' + user.email)
    expect(req.request.method).toBe('GET')

    req.flush(null, {status: 500, statusText: 'Internal Server Error'})
  });
});
