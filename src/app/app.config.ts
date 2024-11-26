import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {requestInterceptor} from './core/interceptors/request/request.interceptor';
import {urlInterceptor} from './core/interceptors/url/url.interceptor';

const interceptors = withInterceptors([requestInterceptor, urlInterceptor]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(interceptors)
  ]
};
