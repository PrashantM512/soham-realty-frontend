import { AbstractControl } from "@angular/forms";

export class FormHelpers {
  
    // Mark all form controls as touched
    static markFormGroupTouched(formGroup: any): void {
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.get(key);
        if (control) {
          control.markAsTouched();
          
          // If it's a nested form group, recursively mark touched
          if (control.controls) {
            this.markFormGroupTouched(control);
          }
        }
      });
    }
  
    // Get error message for a form control
    static getErrorMessage(control: AbstractControl | null, fieldName: string): string {
      if (!control || !control.errors || !control.touched) {
        return '';
      }
  
      const errors = control.errors;
  
      if (errors['required']) {
        return `${fieldName} is required`;
      }
      
      if (errors['email']) {
        return 'Please enter a valid email address';
      }
      
      if (errors['minlength']) {
        return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
      }
      
      if (errors['maxlength']) {
        return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
      }
      
      if (errors['phoneNumber']) {
        return 'Please enter a valid phone number';
      }
      
      if (errors['indianPhoneNumber']) {
        return 'Please enter a valid Indian phone number';
      }
      
      if (errors['zipCode']) {
        return 'Please enter a valid 6-digit ZIP code';
      }
      
      if (errors['minPrice']) {
        return `Price must be at least ₹${errors['minPrice'].requiredPrice}`;
      }
      
      if (errors['squareFootage']) {
        return 'Please enter a valid square footage (1-50,000)';
      }
      
      if (errors['fileSize']) {
        return `File size must not exceed ${errors['fileSize'].maxSize}MB`;
      }
      
      if (errors['fileType']) {
        return `File type not allowed. Allowed types: ${errors['fileType'].allowedTypes.join(', ')}`;
      }
      
      if (errors['url']) {
        return 'Please enter a valid URL';
      }
      
      if (errors['instagramUrl']) {
        return 'Please enter a valid Instagram post or reel URL';
      }
      
      if (errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
  
      // Default error message
      return `${fieldName} is invalid`;
    }
  
    // Reset form with default values
    static resetFormWithDefaults(formGroup: any, defaults: any = {}): void {
      formGroup.reset();
      formGroup.patchValue(defaults);
    }
  }