import {HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  let newUrlReq: HttpRequest<unknown>;

  newUrlReq = req.clone({url: `${environment.api}${req.url}`});

  return next(newUrlReq);
};
