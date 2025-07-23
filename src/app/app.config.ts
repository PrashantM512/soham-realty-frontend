import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { HttpErrorInterceptor } from './components/error-page/http-error.interceptor';
import { AuthInterceptor } from './intercptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi() // Required for class-based interceptors
    ),
    provideAnimationsAsync(),
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
};