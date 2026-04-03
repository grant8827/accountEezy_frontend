import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { EmployeeLoginRequest, EmployeeAuthResponse } from '../../types/index';

@Component({
  selector: 'app-employee-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card-wrapper">
        <mat-card class="login-card">
          <mat-card-header>
            <div class="brand-section">
              <div class="logo-circle">
                <mat-icon>person</mat-icon>
              </div>
              <h1>Employee Portal</h1>
              <p>Access your payslips, leave requests, and more</p>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              @if (errorMessage) {
                <div class="error-banner">
                  <mat-icon>error_outline</mat-icon>
                  <span>{{ errorMessage }}</span>
                </div>
              }

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                />
                <mat-icon matPrefix>email</mat-icon>
                @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
                @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
                <mat-icon matPrefix>lock</mat-icon>
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword"
                >
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                }
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="login-btn"
                [disabled]="loginForm.invalid || loading"
              >
                @if (loading) {
                  <mat-spinner diameter="20"></mat-spinner>
                  <span>Signing In...</span>
                } @else {
                  <ng-container>
                    <mat-icon>login</mat-icon>
                    <span>Sign In</span>
                  </ng-container>
                }
              </button>
            </form>

            <div class="footer-links">
              <a href="/login" class="admin-link">
                <mat-icon>admin_panel_settings</mat-icon>
                Admin Login
              </a>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="info-section">
          <h2>What you can do in the Employee Portal:</h2>
          <ul>
            <li>
              <mat-icon>receipt</mat-icon>
              <span>View and download your payslips</span>
            </li>
            <li>
              <mat-icon>event_available</mat-icon>
              <span>Apply for leave and track requests</span>
            </li>
            <li>
              <mat-icon>notifications</mat-icon>
              <span>See important company notices</span>
            </li>
            <li>
              <mat-icon>person_outline</mat-icon>
              <span>Update your personal information</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .login-card-wrapper {
      max-width: 900px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .login-card {
      padding: 2rem;
    }

    mat-card-header {
      margin-bottom: 2rem;
    }

    .brand-section {
      text-align: center;
      width: 100%;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
    }

    .logo-circle mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: white;
    }

    .brand-section h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .brand-section p {
      margin: 0;
      color: #6b7280;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .error-banner {
      background: #fee2e2;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #991b1b;
      margin-bottom: 1rem;
    }

    .error-banner mat-icon {
      color: #dc2626;
    }

    .login-btn {
      margin-top: 1rem;
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .login-btn mat-spinner {
      display: inline-block;
    }

    .footer-links {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }

    .admin-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }

    .admin-link:hover {
      color: #764ba2;
      gap: 0.75rem;
    }

    .info-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .info-section h2 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .info-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-section li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .info-section mat-icon {
      color: #667eea;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .info-section span {
      color: #4b5563;
      font-size: 0.95rem;
    }

    @media (max-width: 968px) {
      .login-card-wrapper {
        grid-template-columns: 1fr;
      }

      .info-section {
        order: -1;
      }
    }

    @media (max-width: 640px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        padding: 1.5rem;
      }

      .brand-section h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class EmployeeLoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const request: EmployeeLoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.http.post<EmployeeAuthResponse>(`${environment.apiUrl}/employee-auth/login`, request)
        .subscribe({
          next: (response) => {
            // Store employee token separately from admin token
            localStorage.setItem('employeeToken', response.token);
            localStorage.setItem('employeeId', response.employeeId.toString());
            localStorage.setItem('employeeName', response.name);
            localStorage.setItem('employeeEmail', response.email);

            this.loading = false;
            this.router.navigate(['/employee-dashboard/overview']);
          },
          error: (error) => {
            this.loading = false;
            if (error.status === 401) {
              this.errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.status === 403) {
              this.errorMessage = 'Your account is inactive. Please contact your administrator.';
            } else {
              this.errorMessage = 'An error occurred. Please try again later.';
            }
          }
        });
    }
  }
}
