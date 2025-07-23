import {
  Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEditPropertyComponent } from '../add-edit-property/add-edit-property.component';
import { Property } from '../../../../models/property.model';
import { SearchParams } from '../../../../models/search-params.model';
import { PropertyService } from '../../../../services/property.service';
import { UtilityService } from '../../../shared/utility.service';

@Component({
  selector: 'app-properties-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEditPropertyComponent],
  templateUrl: './properties-management.component.html',
  styleUrl: './properties-management.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesManagementComponent implements OnInit {
  properties: Property[] = [];
  showAddEditModal = false;
  selectedProperty: Property | null = null;
  showDeleteConfirm = false;
  propertyToDelete: Property | null = null;
  isLoading = true;

  propertiesCurrentPage = 1;
  propertiesPerPage = 5;
  paginatedProperties: Property[] = [];
  totalPropertiesPages = 0;
  totalProperties = 0;

  constructor(
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    const searchParams: SearchParams = {
      page: this.propertiesCurrentPage,
      limit: this.propertiesPerPage,
      sortBy: 'newest'
    };

    this.propertyService.getAllProperties(searchParams).subscribe({
      next: (response) => {
        this.properties = response.data;
        this.paginatedProperties = response.data;
        this.totalProperties = response.total;
        this.totalPropertiesPages = response.totalPages;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goToPropertiesPage(page: number): void {
    if (page >= 1 && page <= this.totalPropertiesPages) {
      this.propertiesCurrentPage = page;
      this.loadProperties();
    }
  }

  getPropertiesPageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.propertiesCurrentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPropertiesPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(): number {
    return (this.propertiesCurrentPage - 1) * this.propertiesPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.propertiesCurrentPage * this.propertiesPerPage;
    return endIndex > this.totalProperties ? this.totalProperties : endIndex;
  }

  openAddProperty(): void {
    this.selectedProperty = null;
    this.showAddEditModal = true;
  }

  openEditProperty(property: Property): void {
    this.selectedProperty = property;
    this.showAddEditModal = true;
  }

  closeModal(): void {
    this.showAddEditModal = false;
    this.selectedProperty = null;
  }

  onPropertySaved(savedProperty: any): void {
    if (savedProperty.isNew) {
      // For new properties, reload the list
      this.loadProperties();
    } else {
      // For updates, reload the list
      this.loadProperties();
    }
    this.closeModal();
  }

  confirmDelete(property: Property): void {
    this.propertyToDelete = property;
    this.showDeleteConfirm = true;
  }

  deleteProperty(): void {
    if (this.propertyToDelete) {
      this.propertyService.deleteProperty(this.propertyToDelete.id).subscribe({
        next: () => {
          // If we're on the last page and deleting the last item, go to previous page
          if (this.paginatedProperties.length === 1 && this.propertiesCurrentPage > 1) {
            this.propertiesCurrentPage--;
          }
          this.loadProperties();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting property:', error);
          alert('Failed to delete property. Please try again.');
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.propertyToDelete = null;
    this.showDeleteConfirm = false;
  }
  formatPrice(value: number): string {
    return this.utilityService.formatPrice(value);
  }

  // Add these properties
showViewDialog = false;
viewingProperty: any = null;
showImageModal = false;
selectedImage: string = '';

// Add these methods
viewProperty(property: any) {
  this.viewingProperty = property;
  this.showViewDialog = true;
}

closeViewDialog() {
  this.showViewDialog = false;
  this.viewingProperty = null;
}

openImageModal(image: string) {
  this.selectedImage = image;
  this.showImageModal = true;
}

closeImageModal() {
  this.showImageModal = false;
  this.selectedImage = '';
}
}