
// services/auth.service.ts (MOCK VERSION)
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock user for testing
  private mockUser: User = {
    id: 1,
    name: 'Admin User',
    username: 'admin',
    email: 'admin@example.com'
  };

  constructor() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Mock login validation
        if (email === 'admin@example.com' && password === 'password') {
          const token = 'mock-jwt-token-' + Date.now();
          const authData: AuthResponse = {
            user: this.mockUser,
            token: token
          };
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(this.mockUser));
          this.currentUserSubject.next(this.mockUser);
          
          observer.next(authData);
        } else {
          observer.error({
            success: false,
            error: 'Invalid credentials'
          });
        }
        observer.complete();
      }, 800);
    });
  }

  register(userData: { name: string; username: string; email: string; password: string }): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const token = 'mock-jwt-token-' + Date.now();
        const newUser: User = {
          id: 2,
          name: userData.name,
          username: userData.username,
          email: userData.email
        };
        
        const authData: AuthResponse = {
          user: newUser,
          token: token
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        
        observer.next(authData);
        observer.complete();
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}