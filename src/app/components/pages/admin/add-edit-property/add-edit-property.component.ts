// add-edit-property.component.ts - FIXED TYPE ERRORS
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../../../models/property.model';
import { PropertyService } from '../../../../services/property.service';
import { ImageUrlPipe } from '../../../../pipes/image-url-pipe.pipe';

@Component({
  selector: 'app-add-edit-property',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUrlPipe],
  templateUrl: './add-edit-property.component.html',
  styleUrl: './add-edit-property.component.css'
})
export class AddEditPropertyComponent implements OnInit {
  @Input() property: Property | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  formData: any = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    images: [],
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    propertyType: 'House',
    videoLink: '',
    status: 'Available',
    featured: false
  };

  propertyTypes = ['Row House', 'Flat', 'Apartment', 'Condo', 'Farm house', 'Villa', 'Studio Apartment', 'Penthouse', 'Loft', 'Bungalow', 'Independent House'];
  statusOptions = ['Available', 'Sold'];
  cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Nagpur', 'Indore', 'Coimbatore', 'Visakhapatnam', 'Patna', 'Bhopal', 'Vadodara', 'Surat', 'Nashik'];

  selectedFiles: (File | null)[] = [];
  imagePreviews: (string | null)[] = [];
  existingImages: (string | null)[] = [];
  imageStates: ('existing' | 'new' | 'removed')[] = [];
  maxImages = 5;
  isSubmitting = false;

  backendErrors: { [key: string]: string } = {};
  generalError: string = '';
  formSubmitted = false;
  fieldErrors: { [key: string]: string } = {};
  fieldTouched: { [key: string]: boolean } = {};

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.initializeImageArrays();

    if (this.property) {
      this.formData = {
        id: this.property.id,
        title: this.property.title || '',
        price: this.property.price || 0,
        description: this.property.description || '',
        address: this.property.address || '',
        city: this.property.city || '',
        state: this.property.state || '',
        zip: this.property.zip || '',
        bedrooms: this.property.bedrooms || 0,
        bathrooms: Number(this.property.bathrooms) || 0,
        squareFootage: this.property.squareFootage || 0,
        propertyType: this.property.propertyType || 'House',
        videoLink: this.property.videoLink || '',
        status: this.property.status || 'Available',
        featured: this.property.featured || false,
        images: []
      };
      
      if (this.property.images && Array.isArray(this.property.images)) {
        this.property.images.forEach((imageUrl, index) => {
          if (index < this.maxImages) {
            this.existingImages[index] = imageUrl;
            this.imagePreviews[index] = imageUrl;
            this.imageStates[index] = 'existing';
          }
        });
      }
    }
  }

  private initializeImageArrays(): void {
    this.selectedFiles = new Array(this.maxImages).fill(null);
    this.imagePreviews = new Array(this.maxImages).fill(null);
    this.existingImages = new Array(this.maxImages).fill(null);
    this.imageStates = new Array(this.maxImages).fill('removed');
  }

  onFieldChange(fieldName: string, value: any): void {
    let processedValue: any;
    switch (fieldName) {
      case 'price':
      case 'bedrooms':
      case 'bathrooms':
      case 'squareFootage':
        processedValue = value ? Number(value) : 0;
        break;
      case 'featured':
        processedValue = Boolean(value);
        break;
      default:
        processedValue = value || '';
    }
    this.formData[fieldName] = processedValue;
    this.validateField(fieldName, processedValue);
    if (this.backendErrors[fieldName]) {
      delete this.backendErrors[fieldName];
    }
  }

  onInputChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.onFieldChange(fieldName, target.value);
    }
  }

  onSelectChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.onFieldChange(fieldName, target.value);
    }
  }

  onTextareaChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      this.onFieldChange(fieldName, target.value);
    }
  }

  onRadioChange(fieldName: string, value: boolean): void {
    this.onFieldChange(fieldName, value);
  }

  onFieldBlur(fieldName: string): void {
    this.fieldTouched[fieldName] = true;
    this.validateField(fieldName, this.formData[fieldName]);
  }

  private validateField(fieldName: string, value: any): void {
    this.fieldErrors[fieldName] = '';
    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          this.fieldErrors[fieldName] = 'Title is required';
        } else if (value.length < 5) {
          this.fieldErrors[fieldName] = 'Title must be at least 5 characters';
        } else if (value.length > 200) {
          this.fieldErrors[fieldName] = 'Title cannot exceed 200 characters';
        }
        break;
      case 'price':
        const p = Number(value);
        if (p <= 0) {
          this.fieldErrors[fieldName] = 'Price must be greater than 0';
        } else if (p < 1000) {
          this.fieldErrors[fieldName] = 'Price must be at least ₹1,000';
        } else if (p > 999999999) {
          this.fieldErrors[fieldName] = 'Price cannot exceed ₹999,999,999';
        }
        break;
      case 'description':
        if (value && value.length > 1000) {
          this.fieldErrors[fieldName] = 'Description cannot exceed 1000 characters';
        }
        break;
      case 'address':
        if (!value.trim()) {
          this.fieldErrors[fieldName] = 'Address is required';
        } else if (value.length < 5) {
          this.fieldErrors[fieldName] = 'Address must be at least 5 characters';
        } else if (value.length > 200) {
          this.fieldErrors[fieldName] = 'Address cannot exceed 200 characters';
        }
        break;
      case 'city':
        if (!value.trim()) {
          this.fieldErrors[fieldName] = 'City is required';
        } else if (value.length < 2) {
          this.fieldErrors[fieldName] = 'City must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          this.fieldErrors[fieldName] = 'City must contain only letters and spaces';
        }
        break;
      case 'state':
        if (!value.trim()) {
          this.fieldErrors[fieldName] = 'State is required';
        } else if (value.length < 2) {
          this.fieldErrors[fieldName] = 'State must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          this.fieldErrors[fieldName] = 'State must contain only letters and spaces';
        }
        break;
      case 'zip':
        if (!/^[0-9]{6}$/.test(String(value))) {
          this.fieldErrors[fieldName] = 'ZIP code must be exactly 6 digits';
        }
        break;
      case 'bedrooms':
        const b = Number(value);
        if (b < 0) {
          this.fieldErrors[fieldName] = 'Bedrooms cannot be negative';
        } else if (b > 20) {
          this.fieldErrors[fieldName] = 'Bedrooms cannot exceed 20';
        }
        break;
      case 'bathrooms':
        const ba = Number(value);
        if (ba < 0) {
          this.fieldErrors[fieldName] = 'Bathrooms cannot be negative';
        } else if (ba > 20) {
          this.fieldErrors[fieldName] = 'Bathrooms cannot exceed 20';
        }
        break;
      case 'squareFootage':
        const sq = Number(value);
        if (sq < 0) {
          this.fieldErrors[fieldName] = 'Square footage cannot be negative';
        } else if (sq > 50000) {
          this.fieldErrors[fieldName] = 'Square footage cannot exceed 50,000';
        }
        break;
      case 'videoLink':
        if (value) {
          const pattern = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/;
          if (!pattern.test(value)) {
            this.fieldErrors[fieldName] = 'Video link must be a valid Instagram URL';
          }
        }
        break;
    }
  }

  private validateAllFields(): boolean {
    ['title', 'price', 'description', 'address', 'city', 'state', 'zip', 'bedrooms', 'bathrooms', 'squareFootage', 'videoLink']
      .forEach(field => {
        this.validateField(field, this.formData[field]);
        this.fieldTouched[field] = true;
      });

    const hasImage = this.imagePreviews.some(p => p != null);
    this.fieldErrors['images'] = hasImage ? '' : 'At least one image is required';

    return !Object.values(this.fieldErrors).some(e => e);
  }

  shouldShowError(fieldName: string): boolean {
    return ((this.formSubmitted || this.fieldTouched[fieldName]) && !!(this.fieldErrors[fieldName] || this.backendErrors[fieldName]))
      || !!this.backendErrors[fieldName];
  }
  
  getFieldErrorMessage(fieldName: string): string {
    return this.backendErrors[fieldName] || this.fieldErrors[fieldName] || '';
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      this.selectedFiles[index] = file;
      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreviews[index] = (e.target as any).result;
        this.imageStates[index] = 'new';
        if (this.imagePreviews.some(p => p != null)) {
          this.fieldErrors['images'] = '';
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.selectedFiles[index] = null;
    this.imagePreviews[index] = null;
    this.imageStates[index] = 'removed';
    if (!this.imagePreviews.some(p => p != null)) {
      this.fieldErrors['images'] = 'At least one image is required';
    }
    const input = document.getElementById(`image${index}`) as HTMLInputElement;
    if (input) input.value = '';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.clearErrors();
    if (!this.validateAllFields()) {
      this.scrollToFirstError();
      return;
    }
    this.isSubmitting = true;
    const data = {...this.formData}; delete data.images; delete data.id;
    this.property ? this.updateExistingProperty(data) : this.createNewProperty(data);
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const fields = Object.keys(this.fieldErrors).filter(k => this.fieldErrors[k]);
      if (fields.length) {
        const el = document.getElementById(fields[0]);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus();
        }
      }
    }, 100);
  }

  private updateExistingProperty(propertyData: any): void {
    this.propertyService.updateProperty(this.property!.id, propertyData).subscribe({
      next: (response) => {
        const updatedProperty = response.data;
        this.handleImageUpdates(updatedProperty.id, () => {
          this.isSubmitting = false;
          this.propertyService.getPropertyById(updatedProperty.id).subscribe({
            next: (propertyResponse) => {
              this.save.emit({ ...propertyResponse.data, isNew: false });
            },
            error: (error) => {
              console.error('Error reloading property:', error);
              this.save.emit({ ...updatedProperty, isNew: false });
            }
          });
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
      }
    });
  }

  private createNewProperty(propertyData: any): void {
    this.propertyService.createProperty(propertyData).subscribe({
      next: (response) => {
        const newProperty = response.data;
        const newFiles = this.selectedFiles.filter(f => f !== null) as File[];
        if (newFiles.length > 0) {
          this.propertyService.uploadPropertyImages(newProperty.id, newFiles).subscribe({
            next: (uploadResponse) => {
              this.isSubmitting = false;
              this.propertyService.getPropertyById(newProperty.id).subscribe({
                next: (propertyResponse) => {
                  this.save.emit({ ...propertyResponse.data, isNew: true });
                }
              });
            },
            error: (error) => {
              this.isSubmitting = false;
              this.handleError(error);
            }
          });
        } else {
          this.isSubmitting = false;
          this.save.emit({ ...newProperty, isNew: true });
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
      }
    });
  }

  private handleImageUpdates(propertyId: number, callback: () => void): void {
    const hasChanges = this.imageStates.some(state => state === 'new' || state === 'removed');
    
    if (!hasChanges) {
      callback();
      return;
    }

    const newFiles = this.selectedFiles.filter(f => f !== null) as File[];
    
    if (newFiles.length > 0) {
      this.propertyService.uploadPropertyImages(propertyId, newFiles).subscribe({
        next: (response) => {
          console.log('Images updated successfully');
          callback();
        },
        error: (error) => {
          console.error('Error updating images:', error);
          this.generalError = 'Property saved but some images failed to upload.';
          callback();
        }
      });
    } else {
      callback();
    }
  }

  isFormValid(): boolean {
    if (!this.formSubmitted) {
      const hasAtLeastOneImage = this.imagePreviews.some(preview => preview !== null);
      return !!(
        this.formData.title &&
        this.formData.price > 0 &&
        this.formData.address &&
        this.formData.city &&
        this.formData.state &&
        this.formData.zip &&
        hasAtLeastOneImage
      );
    } else {
      return !Object.values(this.fieldErrors).some(error => error.length > 0) &&
             !Object.values(this.backendErrors).some(error => error.length > 0);
    }
  }

  private handleError(error: any): void {
    console.error('Error saving property:', error);
    
    if (error.status === 400 && error.error && error.error.data) {
      this.backendErrors = error.error.data;
      this.generalError = error.error.message || 'Please fix the validation errors below.';
    } else if (error.status === 400 && error.error && error.error.error) {
      this.generalError = error.error.error;
    } else {
      this.generalError = 'Failed to save property. Please try again.';
    }
    
    this.scrollToFirstError();
  }

  private clearErrors(): void {
    this.backendErrors = {};
    this.generalError = '';
  }

  onCancel(): void {
    this.clearErrors();
    this.fieldErrors = {};
    this.fieldTouched = {};
    this.formSubmitted = false;
    this.close.emit();
  }

  // Helper methods
  getImageIndexes(): number[] {
    return Array(this.maxImages).fill(0).map((_, i) => i);
  }

  trackByIndex(index: number): number {
    return index;
  }

  hasImage(index: number): boolean {
    return this.imagePreviews[index] !== null;
  }

  getImagePreview(index: number): string | null {
    return this.imagePreviews[index];
  }

  // FIXED: Helper method to get character count safely
  getCharacterCount(text: any): number {
    return text ? String(text).length : 0;
  }
}