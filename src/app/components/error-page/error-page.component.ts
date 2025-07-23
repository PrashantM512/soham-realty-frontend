import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, CommonModule, DatePipe } from '@angular/common';
import { ErrorInfo } from '../../services/global-error-handler.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  errorInfo: ErrorInfo | null = null;
  showDeveloperInfo = false;

  constructor(
    private router: Router,
    private location: Location
  ) {
    // Get error info from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.errorInfo = navigation?.extras?.state?.['errorInfo'] || null;
  }

  ngOnInit(): void {
    // Set to true if you want to show developer info in development
    this.showDeveloperInfo = this.isDevelopmentMode();
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.location.back();
  }

  reload(): void {
    window.location.reload();
  }

  private isDevelopmentMode(): boolean {
    return !!(window as any)['ng'] || location.hostname === 'localhost';
  }
}