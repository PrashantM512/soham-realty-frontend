import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorInfo {
  message: string;
  statusCode?: number;
  timestamp: Date;
  url?: string;
  stack?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}

  handleError(error: any): void {
    console.error('Global error caught:', error);
    
    const errorInfo: ErrorInfo = {
      message: this.getErrorMessage(error),
      timestamp: new Date(),
      url: window.location.href
    };

    if (error instanceof HttpErrorResponse) {
      errorInfo.statusCode = error.status;
      errorInfo.message = this.getHttpErrorMessage(error);
    }

    if (error?.stack) {
      errorInfo.stack = error.stack;
    }

    // Navigate to error page within Angular zone
    this.ngZone.run(() => {
      this.router.navigate(['/error'], { 
        state: { errorInfo } 
      });
    });
  }

  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      return this.getHttpErrorMessage(error);
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Network connection error. Please check your internet connection.';
      case 400:
        return 'Bad request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to access this resource.';
      case 403:
        return 'Access forbidden. You don\'t have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
    }
  }
}