import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'accounteezy_token';
  private readonly emailKey = 'accounteezy_email';

  private tokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));
  private emailSignal = signal<string | null>(localStorage.getItem(this.emailKey));

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly email = computed(() => this.emailSignal());
  readonly token = computed(() => this.tokenSignal());

  constructor(private http: HttpClient) {}

  register(payload: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  login(payload: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    this.tokenSignal.set(null);
    this.emailSignal.set(null);
  }

  private storeSession(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.emailKey, response.email);
    this.tokenSignal.set(response.token);
    this.emailSignal.set(response.email);
  }
}
