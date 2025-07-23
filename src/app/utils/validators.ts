import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  // Phone number validator
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Don't validate empty values, use Validators.required for that
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : { phoneNumber: { value: control.value } };
  }

  // Indian phone number validator
  static indianPhoneNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const indianPhoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    const valid = indianPhoneRegex.test(control.value.replace(/\s/g, ''));
    return valid ? null : { indianPhoneNumber: { value: control.value } };
  }

  // ZIP code validator
  static zipCode(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const zipRegex = /^\d{6}$/; // Indian ZIP code format
    const valid = zipRegex.test(control.value);
    return valid ? null : { zipCode: { value: control.value } };
  }

  // Price validator (minimum value)
  static minPrice(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const value = parseFloat(control.value);
      return value >= minValue ? null : { minPrice: { requiredPrice: minValue, actualPrice: value } };
    };
  }

  // Square footage validator
  static squareFootage(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const value = parseFloat(control.value);
    return value > 0 && value <= 50000 ? null : { squareFootage: { value: control.value } };
  }

  // File size validator (for image uploads)
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const file = control.value as File;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      return file.size <= maxSizeInBytes 
        ? null 
        : { fileSize: { maxSize: maxSizeInMB, actualSize: Math.round(file.size / 1024 / 1024 * 100) / 100 } };
    };
  }

  // File type validator
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const file = control.value as File;
      const fileType = file.type;
      
      return allowedTypes.includes(fileType) 
        ? null 
        : { fileType: { allowedTypes, actualType: fileType } };
    };
  }

  // URL validator (for video links)
  static url(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    try {
      new URL(control.value);
      return null;
    } catch {
      return { url: { value: control.value } };
    }
  }

  // Instagram URL validator
  static instagramUrl(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+\/?$/;
    const valid = instagramRegex.test(control.value);
    return valid ? null : { instagramUrl: { value: control.value } };
  }

  // Password match validator (for registration form)
  static passwordMatch(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordControlName);
      const confirmPassword = control.get(confirmPasswordControlName);
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        // Clear the error if passwords match
        if (confirmPassword.errors?.['passwordMismatch']) {
          delete confirmPassword.errors['passwordMismatch'];
          if (Object.keys(confirmPassword.errors).length === 0) {
            confirmPassword.setErrors(null);
          }
        }
        return null;
      }
    };
  }
}