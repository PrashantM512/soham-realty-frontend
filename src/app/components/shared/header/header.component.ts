// header.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Adjust path as needed

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isAdmin = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.checkAuthStatus();
    
    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = !!user;
    });
  }

  // Listen for scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 50;
  }

  // Listen for clicks outside mobile menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Close mobile menu if click is outside menu and toggle button
    if (this.isMobileMenuOpen && 
        !mobileToggle?.contains(target) && 
        !navMenu?.contains(target)) {
      this.closeMobileMenu();
    }
  }

  // Listen for escape key to close mobile menu
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Check if user is authenticated
  private checkAuthStatus(): void {
    this.isAdmin = this.authService.isAuthenticated();
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  // Close mobile menu
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  // Logout functionality
  logout(): void {
    this.authService.logout();
    this.isAdmin = false;
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  // Navigation helper (optional)
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }
}