import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have value as true', (done) => {
    service.isLoading.subscribe(isLoading => {
      if (isLoading) {
        expect(isLoading).toBeTrue();
        done();
      }
    });

    service.emitLoading(true);
  });

});
