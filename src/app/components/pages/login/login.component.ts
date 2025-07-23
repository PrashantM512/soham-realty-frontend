// login.component.ts - FIXED VERSION
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loginError = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          console.log('Login successful:', response);
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.loginError = 'Invalid credentials. Please try again.';
          console.error('Login error:', error);
          // Don't navigate to error page, just show the error message
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  get email() { 
    return this.loginForm.get('email'); 
  }
  
  get password() { 
    return this.loginForm.get('password'); 
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}