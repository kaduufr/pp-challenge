import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';

import {requestInterceptor} from './request.interceptor';
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing';
import {LoadingService} from '../../../shared/services/loading/loading.service';

describe('requestInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => requestInterceptor(req, next));

  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
        LoadingService
      ],
      imports: []
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService); // Get the injected loading service

  });

  it('should validate url before request', () => {
    expect(interceptor).toBeTruthy();

    spyOn(loadingService, 'emitLoading'); // Spy on the emitLoading method

    httpClient.get('/api/test').subscribe();
    const req: TestRequest = httpMock.expectOne('/api/test');

    expect(loadingService.emitLoading).toHaveBeenCalledWith(true);
    req.flush({});
    expect(loadingService.emitLoading).toHaveBeenCalledWith(false);

    httpMock.verify()
  });
});
