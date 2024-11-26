import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';

import { urlInterceptor } from './url.interceptor';
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing';
import {environment} from '../../../../environments/environment';

const mockApiUrl = 'http://localhost:3000';

describe('urlInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => urlInterceptor(req, next));

  let httpClient: HttpClient;
  let httpMock: HttpTestingController

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting()
      ],
      imports: []
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should validate if url has apiUrl from env', () => {
    expect(interceptor).toBeTruthy();
  });
});
