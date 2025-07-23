// register.component.ts - FIXED VERSION
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  registerError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit() {
    console.log('Form submitted'); // Debug log
    console.log('Form valid:', this.registerForm.valid); // Debug log
    console.log('Form values:', this.registerForm.value); // Debug log
    
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.registerError = '';
      
      const { name, username, email, password } = this.registerForm.value;
      
      this.authService.register({ name, username, email, password }).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          console.log('Registration successful:', response);
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.error?.error) {
            this.registerError = error.error.error;
          } else {
            this.registerError = 'Registration failed. Please try again.';
          }
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  get name() { return this.registerForm.get('name'); }
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}