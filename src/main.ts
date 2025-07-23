import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandlerService } from './app/services/global-error-handler.service';

bootstrapApplication(AppComponent, {
  providers: [
    // Router configuration
    provideRouter(routes),
    
    // Global Error Handler
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    
    // Import necessary modules
    importProvidersFrom(
      CommonModule,
      HttpClientModule
    )
  ]
}).catch(err => console.error(err));
