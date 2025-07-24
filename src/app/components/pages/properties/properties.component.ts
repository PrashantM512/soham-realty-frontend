import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Property } from '../../../models/property.model';
import { SearchParams } from '../../../models/search-params.model';
import { PRICE_RANGES, PROPERTY_TYPES, CITIES, BEDROOM_OPTIONS, formatPrice } from '../../shared/property-data';
import { PropertyService } from '../../../services/property.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImageUrlPipe } from '../../../pipes/image-url-pipe.pipe';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,ImageUrlPipe],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchQuery = '';
  filters = {
    priceRange: '',
    location: '',
    propertyType: '',
    bedrooms: ''
  };
  sortBy = 'newest';
  priceRanges = PRICE_RANGES;
  locations = CITIES;
  propertyTypes = ['All Types', ...PROPERTY_TYPES];
  bedroomOptions = BEDROOM_OPTIONS;
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;
  displayedProperties: Property[] = [];
  isLoading = true;
  error = '';
  dropdownStates = {
    priceRange: false,
    location: false,
    propertyType: false,
    bedrooms: false,
    sort: false
  };

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.searchQuery = params['search'] || '';
        this.filters.location = params['location'] || '';
        this.filters.priceRange = params['priceRange'] || '';
        this.filters.propertyType = params['propertyType'] || '';
        this.filters.bedrooms = params['bedrooms'] || '';
        this.currentPage = +params['page'] || 1;
        this.sortBy = params['sortBy'] || 'newest';
        this.loadProperties();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.error = '';
    this.cdr.markForCheck();

    const searchParams: SearchParams = {
      search: this.searchQuery?.trim() || undefined,
      location: this.filters.location || undefined,
      priceRange: this.filters.priceRange || undefined,
      propertyType: this.filters.propertyType !== 'All Types' ? this.filters.propertyType : undefined,
      bedrooms: this.filters.bedrooms !== 'Any' ? this.filters.bedrooms : undefined,
      page: this.currentPage,
      limit: this.itemsPerPage,
      sortBy: this.sortBy
    };

    this.propertyService.getAllProperties(searchParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.displayedProperties = response.data;
          this.totalPages = response.totalPages;
          this.currentPage = response.page;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Failed to load properties';
          this.isLoading = false;
          this.cdr.markForCheck();
          console.error('Error loading properties:', error);
          this.loadFallbackData();
        }
      });
  }

  loadFallbackData(): void {
    import('../../shared/property-data').then(module => {
      this.displayedProperties = module.MOCK_PROPERTIES;
      this.totalPages = Math.ceil(this.displayedProperties.length / this.itemsPerPage);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProperties();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchQuery || null, page: 1 },
      queryParamsHandling: 'merge'
    });
    this.loadProperties();
  }

  setFilter(filterType: string, value: string): void {
    this.filters[filterType as keyof typeof this.filters] = value;
    this.currentPage = 1;
    this.loadProperties();
    this.closeDropdowns();
  }

  private updateUrlParams(): void {
    const queryParams: any = {
      title: this.searchQuery || null,
      location: this.filters.location || null,
      priceRange: this.filters.priceRange || null,
      propertyType: this.filters.propertyType || null,
      bedrooms: this.filters.bedrooms || null,
      sortBy: this.sortBy !== 'newest' ? this.sortBy : null,
      page: this.currentPage > 1 ? this.currentPage : null
    };

    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  setSortBy(sortOption: string): void {
    this.sortBy = sortOption;
    this.currentPage = 1;
    this.loadProperties();
    this.closeDropdowns();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProperties();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleDropdown(dropdown: string): void {
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== dropdown) {
        this.dropdownStates[key as keyof typeof this.dropdownStates] = false;
      }
    });
    this.dropdownStates[dropdown as keyof typeof this.dropdownStates] =
      !this.dropdownStates[dropdown as keyof typeof this.dropdownStates];
  }

  closeDropdowns(): void {
    Object.keys(this.dropdownStates).forEach(key => {
      this.dropdownStates[key as keyof typeof this.dropdownStates] = false;
    });
  }

  formatPrice(price: number): string {
    return formatPrice(price);
  }

  getFilterLabel(filterType: string): string {
    const filter = this.filters[filterType as keyof typeof this.filters];
    if (!filter || filter === 'All Cities' || filter === 'All Types' || filter === 'Any') {
      switch (filterType) {
        case 'priceRange': return 'Price Range';
        case 'location': return 'Location';
        case 'propertyType': return 'Property Type';
        case 'bedrooms': return 'Bedrooms';
        default: return '';
      }
    }

    if (filterType === 'priceRange') {
      return this.priceRanges.find((r: { value: string; }) => r.value === filter)?.label || filter;
    }
    return filter;
  }

  clearFilters(): void {
    this.filters = {
      priceRange: '',
      location: '',
      propertyType: '',
      bedrooms: ''
    };
    this.searchQuery = '';
    this.currentPage = 1;
    this.sortBy = 'newest';
    this.loadProperties();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return endIndex > this.displayedProperties.length ? this.displayedProperties.length : endIndex;
  }
  trackByPropertyId(index: number, property: Property): number {
    return property.id;
  }

  trackByPageNumber(index: number, page: number): number {
    return page;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image-available.png';
  }

  // Get the primary image URL for a property
  getPropertyImage(property: Property): string {
    // Check if property has images array
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    // Check if property has single imageUrl
    if (property.imageUrl) {
      return property.imageUrl;
    }
    // Return null to trigger default image in pipe
    return '';
  }

}