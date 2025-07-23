// add-edit-property.component.ts - FIXED TYPE ERRORS
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Property } from '../../../../models/property.model';
import { PropertyService } from '../../../../services/property.service';

@Component({
  selector: 'app-add-edit-property',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  propertyTypes = ['Row House', 'Flat', 'Apartment', 'Condo', 'Farm house', 'Villa', 'Studio Apartment', 'Penthouse', 'Loft', 'Row House', 'Bungalow', 'Independent House'];
  statusOptions = ['Available', 'Sold'];
  // In your TS (e.g. contact.component.ts)
cities = ['Pune','Mumbai','Delhi','Bangalore','Chennai','Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Nagpur', 'Indore', 'Coimbatore', 'Visakhapatnam', 'Patna', 'Bhopal', 'Vadodara', 'Surat', 'Nashik'];

  
  // Image management arrays
  selectedFiles: (File | null)[] = [];
  imagePreviews: (string | null)[] = [];
  existingImages: (string | null)[] = [];
  imageStates: ('existing' | 'new' | 'removed')[] = [];
  maxImages = 5;
  isSubmitting = false;

  // Validation tracking
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

  // FIXED: Proper type handling for field changes
  onFieldChange(fieldName: string, value: any): void {
    // FIXED: Handle different field types properly
    let processedValue = value;
    
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
    
    // Clear backend error for this field when user starts typing
    if (this.backendErrors[fieldName]) {
      delete this.backendErrors[fieldName];
    }
  }

  // FIXED: Proper event handling for input events
  onInputChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.onFieldChange(fieldName, target.value);
    }
  }

  // FIXED: Proper event handling for select events
  onSelectChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.onFieldChange(fieldName, target.value);
    }
  }

  // FIXED: Proper event handling for textarea events
  onTextareaChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      this.onFieldChange(fieldName, target.value);
    }
  }

  // FIXED: Proper event handling for radio buttons
  onRadioChange(fieldName: string, value: boolean): void {
    this.onFieldChange(fieldName, value);
  }

  onFieldBlur(fieldName: string): void {
    this.fieldTouched[fieldName] = true;
    this.validateField(fieldName, this.formData[fieldName]);
  }

  // FIXED: Enhanced validation with proper type checking
  private validateField(fieldName: string, value: any): void {
    this.fieldErrors[fieldName] = '';

    switch (fieldName) {
      case 'title':
        if (!value || String(value).trim().length === 0) {
          this.fieldErrors[fieldName] = 'Title is required';
        } else if (String(value).length < 5) {
          this.fieldErrors[fieldName] = 'Title must be at least 5 characters';
        } else if (String(value).length > 200) {
          this.fieldErrors[fieldName] = 'Title cannot exceed 200 characters';
        }
        break;

      case 'price':
        const priceValue = Number(value);
        if (!value || priceValue <= 0) {
          this.fieldErrors[fieldName] = 'Price is required and must be greater than 0';
        } else if (priceValue < 1000) {
          this.fieldErrors[fieldName] = 'Price must be at least ₹1,000';
        } else if (priceValue > 999999999) {
          this.fieldErrors[fieldName] = 'Price cannot exceed ₹999,999,999';
        }
        break;

      case 'description':
        if (value && String(value).length > 1000) {
          this.fieldErrors[fieldName] = 'Description cannot exceed 1000 characters';
        }
        break;

      case 'address':
        if (!value || String(value).trim().length === 0) {
          this.fieldErrors[fieldName] = 'Address is required';
        } else if (String(value).length < 5) {
          this.fieldErrors[fieldName] = 'Address must be at least 5 characters';
        } else if (String(value).length > 200) {
          this.fieldErrors[fieldName] = 'Address cannot exceed 200 characters';
        }
        break;

      case 'city':
        if (!value || String(value).trim().length === 0) {
          this.fieldErrors[fieldName] = 'City is required';
        } else if (String(value).length < 2) {
          this.fieldErrors[fieldName] = 'City must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(String(value))) {
          this.fieldErrors[fieldName] = 'City must contain only letters and spaces';
        }
        break;

      case 'state':
        if (!value || String(value).trim().length === 0) {
          this.fieldErrors[fieldName] = 'State is required';
        } else if (String(value).length < 2) {
          this.fieldErrors[fieldName] = 'State must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(String(value))) {
          this.fieldErrors[fieldName] = 'State must contain only letters and spaces';
        }
        break;

      case 'zip':
        if (!value || String(value).trim().length === 0) {
          this.fieldErrors[fieldName] = 'ZIP code is required';
        } else if (!/^\d{6}$/.test(String(value))) {
          this.fieldErrors[fieldName] = 'ZIP code must be exactly 6 digits';
        }
        break;

      case 'bedrooms':
        const bedroomsValue = Number(value);
        if (bedroomsValue < 0) {
          this.fieldErrors[fieldName] = 'Bedrooms cannot be negative';
        } else if (bedroomsValue > 20) {
          this.fieldErrors[fieldName] = 'Bedrooms cannot exceed 20';
        }
        break;

      case 'bathrooms':
        const bathroomsValue = Number(value);
        if (bathroomsValue < 0) {
          this.fieldErrors[fieldName] = 'Bathrooms cannot be negative';
        } else if (bathroomsValue > 20) {
          this.fieldErrors[fieldName] = 'Bathrooms cannot exceed 20';
        }
        break;

      case 'squareFootage':
        const squareFootageValue = Number(value);
        if (squareFootageValue < 0) {
          this.fieldErrors[fieldName] = 'Square footage cannot be negative';
        } else if (squareFootageValue > 50000) {
          this.fieldErrors[fieldName] = 'Square footage cannot exceed 50,000';
        }
        break;

      case 'videoLink':
        if (value && String(value).trim().length > 0) {
          const instagramPattern = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?.*$/;
          if (!instagramPattern.test(String(value))) {
            this.fieldErrors[fieldName] = 'Video link must be a valid Instagram URL (posts, reels, or IGTV)';
          }
        }
        break;
    }
  }

  private validateAllFields(): boolean {
    const fields = ['title', 'price', 'description', 'address', 'city', 'state', 'zip', 'bedrooms', 'bathrooms', 'squareFootage', 'videoLink'];
    
    fields.forEach(field => {
      this.validateField(field, this.formData[field]);
      this.fieldTouched[field] = true;
    });

    const hasAtLeastOneImage = this.imagePreviews.some(preview => preview !== null);
    if (!hasAtLeastOneImage) {
      this.fieldErrors['images'] = 'At least one image is required';
    } else {
      this.fieldErrors['images'] = '';
    }

    return !Object.values(this.fieldErrors).some(error => error.length > 0);
  }

  shouldShowError(fieldName: string): boolean {
    return (
      (this.formSubmitted || this.fieldTouched[fieldName]) && 
      !!(this.fieldErrors[fieldName] || this.backendErrors[fieldName])
    ) || !!this.backendErrors[fieldName];
  }
  

  getFieldErrorMessage(fieldName: string): string {
    return this.backendErrors[fieldName] || this.fieldErrors[fieldName] || '';
  }

  // FIXED: Proper event handling for file selection
  onFileSelected(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      this.selectedFiles[index] = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews[index] = e.target.result;
        this.imageStates[index] = 'new';
        
        const hasAtLeastOneImage = this.imagePreviews.some(preview => preview !== null);
        if (hasAtLeastOneImage) {
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
    
    const hasAtLeastOneImage = this.imagePreviews.some(preview => preview !== null);
    if (!hasAtLeastOneImage) {
      this.fieldErrors['images'] = 'At least one image is required';
    }
    
    const fileInput = document.getElementById(`image${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.clearErrors();

    const isClientValidationValid = this.validateAllFields();
    
    if (!isClientValidationValid) {
      this.scrollToFirstError();
      return;
    }

    this.isSubmitting = true;

    const propertyData = { ...this.formData };
    delete propertyData.images;
    delete propertyData.id;

    if (this.property) {
      this.updateExistingProperty(propertyData);
    } else {
      this.createNewProperty(propertyData);
    }
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const errorFields = Object.keys(this.fieldErrors).filter(key => this.fieldErrors[key]);
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
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