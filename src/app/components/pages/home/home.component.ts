import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Property } from '../../../models/property.model';
import { SearchParams } from '../../../models/search-params.model';
import { formatPrice, PRICE_RANGES, PROPERTY_TYPES } from '../../shared/property-data';
import { PropertyService } from '../../../services/property.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Search form data
  searchForm = {
    search: '', // Changed from location to search
    priceRange: '',
    propertyType: ''
  };

  // Filter options
  priceRanges = PRICE_RANGES;
  propertyTypes = PROPERTY_TYPES;

  // Featured properties
  featuredProperties: Property[] = [];
  isLoading = true;
  error = '';

  // Carousel state
  currentSlideIndex = 0;
  autoSlideInterval: any;

  // Advanced search visibility
  showAdvancedSearch = false;

  @ViewChild('featuredPropertiesSection') featuredPropertiesElement!: ElementRef;

  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProperties();
    this.startAutoSlide();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/' || event.url === '/home') {
        setTimeout(() => {
          this.refreshFeaturedProperties();
        }, 100);
      }
    });

    window.addEventListener('focus', this.onWindowFocus.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    window.removeEventListener('focus', this.onWindowFocus.bind(this));
  }

  private onWindowFocus(): void {
    this.refreshFeaturedProperties();
  }

  loadFeaturedProperties(): void {
    this.isLoading = true;
    this.error = '';

    this.propertyService.getFeaturedProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.featuredProperties = response.data || [];
          this.isLoading = false;
          
          if (this.currentSlideIndex >= this.featuredProperties.length) {
            this.currentSlideIndex = 0;
          }
          
          console.log('Featured properties loaded:', this.featuredProperties.length);
        },
        error: (error) => {
          this.error = 'Failed to load featured properties';
          this.isLoading = false;
          this.featuredProperties = [];
          console.error('Error loading featured properties:', error);
        }
      });
  }

  refreshFeaturedProperties(): void {
    const wasLoading = this.isLoading;
    this.error = '';

    this.propertyService.getFeaturedProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const newProperties = response.data || [];
          
          if (JSON.stringify(this.featuredProperties) !== JSON.stringify(newProperties)) {
               this.featuredProperties = newProperties;
            
            if (this.currentSlideIndex >= this.featuredProperties.length) {
              this.currentSlideIndex = 0;
            }
            
            console.log('Featured properties refreshed:', this.featuredProperties.length);
          }
          
          if (!wasLoading) {
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error refreshing featured properties:', error);
          if (!wasLoading) {
            this.isLoading = false;
          }
        }
      });
  }

  public forceRefresh(): void {
    this.loadFeaturedProperties();
  }

  scrollToFeatured(): void {
    if (!this.featuredPropertiesElement) return;
    
    const target = this.featuredPropertiesElement.nativeElement;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500;

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

  search(): void {
    const searchParams: SearchParams = {
      search: this.searchForm.search || undefined, // Changed from location to search
      priceRange: this.searchForm.priceRange || undefined,
      propertyType: this.searchForm.propertyType || undefined,
      page: 1,
      limit: 9
    };

    this.router.navigate(['/properties'], { 
      queryParams: searchParams 
    });
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

  nextSlide(): void {
    if (this.featuredProperties.length === 0) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.featuredProperties.length;
  }

  previousSlide(): void {
    if (this.featuredProperties.length === 0) return;
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.featuredProperties.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.featuredProperties.length) {
      this.currentSlideIndex = index;
    }
  }

  private startAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    
    this.autoSlideInterval = setInterval(() => {
      if (this.featuredProperties.length > 1) {
        this.nextSlide();
      }
    }, 5000);
  }

  trackByPropertyId(index: number, property: Property): number {
    return property.id;
  }

  hasFeaturedProperties(): boolean {
    return this.featuredProperties && this.featuredProperties.length > 0;
  }

  getCurrentSlideProperty(): Property | null {
    if (!this.hasFeaturedProperties()) return null;
    return this.featuredProperties[this.currentSlideIndex] || null;
  }
}