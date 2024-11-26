import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {LoadingService} from '../../../shared/services/loading/loading.service';
import {finalize} from 'rxjs';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.emitLoading(true);
  return next(req)
    .pipe(finalize(() => loadingService.emitLoading(false)));
};
