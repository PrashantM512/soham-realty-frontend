import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GlobalErrorHandlerService } from '../../services/global-error-handler.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: GlobalErrorHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }
}