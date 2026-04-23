import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  email: string;
  businessId?: number | null;
  businessName?: string | null;
  expiresAtUtc?: string;
  trialStartDate?: string;
  trialExpiresAt?: string;
  isTrialExpired?: boolean;
  isEmployee?: boolean;
  employeeId?: number | null;
  employeeName?: string | null;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  // retained for display compatibility
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  // Personal Information (match backend PascalCase or let ASP.NET handle case-insensitive mapping)
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;

  // Business Information
  businessName: string;
  registrationNumber?: string;
  trn: string;
  nis: string;
  businessType: string;
  industry: string;
  fiscalYearEnd?: Date;

  // Address Information
  street: string;
  city: string;
  parish: string;
  postalCode?: string;
  country: string;

  // Contact Information
  businessPhone: string;
  businessEmail: string;
  website?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public user$ = this.userSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const token = localStorage.getItem('accounteezy_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr && this.isTokenValid()) {
      try {
        const user = JSON.parse(userStr);
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  private isTokenValid(): boolean {
    const token = localStorage.getItem('accounteezy_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<AuthResponse>(environment.apiUrl + '/auth/login', credentials).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (response.success && response.data) {
          // Only store accounteezy_token for admin/super-admin logins, not for employees
          if (!response.data.user.isEmployee || response.data.user.isAdmin || response.data.user.isSuperAdmin) {
            localStorage.setItem('accounteezy_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.userSubject.next(response.data.user);
            this.isAuthenticatedSubject.next(true);
          }
        } else {
          this.errorSubject.next(response.message || 'Login failed');
        }
        this.isLoadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Login error:', error);
        const errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
        this.errorSubject.next(errorMessage);
        this.isLoadingSubject.next(false);
        throw error;
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<AuthResponse>(environment.apiUrl + '/auth/register', userData).pipe(
      tap(response => {
        console.log('Register response:', response);
        if (response.success && response.data) {
          localStorage.setItem('accounteezy_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.userSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
        } else {
          this.errorSubject.next(response.message || 'Registration failed');
        }
        this.isLoadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        const errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
        this.errorSubject.next(errorMessage);
        this.isLoadingSubject.next(false);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accounteezy_token');
    localStorage.removeItem('token'); // remove legacy key if present
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isTrialExpired(): boolean {
    // Trial enforcement disabled during development
    return false;
  }

  getDaysLeftInTrial(): number {
    const user = this.userSubject.value;
    if (!user?.trialExpiresAt) return 0;
    const msLeft = new Date(user.trialExpiresAt).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  }

  getTrialExpiresAt(): Date | null {
    const user = this.userSubject.value;
    if (!user?.trialExpiresAt) return null;
    return new Date(user.trialExpiresAt);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  isSuperAdmin(): boolean {
    return this.userSubject.value?.isSuperAdmin === true;
  }
}
