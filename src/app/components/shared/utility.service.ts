// shared/utility.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  
  formatPrice(price: number): string {
    // For amounts less than 1 lakh (100,000), show in plain INR
    if (price < 100000) {
      return '₹' + new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
      }).format(price);
    }
    
    // For amounts between 1 lakh and 1 crore (1,00,00,000)
    if (price < 10000000) {
      const lakhs = (price / 100000).toFixed(2);
      return '₹' + lakhs + ' Lakh';
    }
    
    // For amounts 1 crore and above
    const crores = (price / 10000000).toFixed(2);
    return '₹' + crores + ' Crore';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  smoothScrollTo(element: HTMLElement, offset: number = 100, duration: number = 1500): void {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number;

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      window.scrollTo(0, startPosition + distance * progress);
      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  }
}

// Update components to use the service:
// Remove formatPrice() method from:
// - HomeComponent
// - PropertiesComponent  
// - PropertiesManagementComponent
// - PropertyDetailsComponent

// Inject UtilityService and use this.utilityService.formatPrice(price)