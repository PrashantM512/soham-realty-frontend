// auth.service.ts - UPDATED VERSION
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => response.data),
        tap(authData => {
          // Store token and user
          localStorage.setItem('token', authData.token);
          localStorage.setItem('user', JSON.stringify(authData.user));
          this.currentUserSubject.next(authData.user);
        })
      );
  }

  register(userData: { name: string; username: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => response.data),
        tap(authData => {
          // Store token and user
          localStorage.setItem('token', authData.token);
          localStorage.setItem('user', JSON.stringify(authData.user));
          this.currentUserSubject.next(authData.user);
        })
      );
  }

  logout(): void {
    // Clear stored data
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