import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="auth-root">
      <!-- Background orbs -->
      <div class="orb orb-left"></div>
      <div class="orb orb-right"></div>

      <div class="auth-card">
        <!-- Logo -->
        <div class="logo-wrap">
          <div class="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="url(#lg1)"/>
              <path d="M9 22L14 10L19 18L22 14L26 22H9Z" fill="white" fill-opacity="0.9"/>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">AccountEezy</span>
        </div>

        <!-- ─── LOGIN VIEW ─── -->
        @if (!showForgot) {
          <div class="view-login">
            <h1>Welcome back</h1>
            <p class="subtitle">Sign in to your business account</p>

            @if (registeredPending) {
              <div class="alert alert-pending">
                <mat-icon>hourglass_empty</mat-icon>
                Registration received! Your account is pending approval. You will be able to log in once activated.
              </div>
            }

            @if (error$ | async; as err) {
              <div class="alert alert-error">
                <mat-icon>error_outline</mat-icon> {{ err }}
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              <div class="field-wrap">
                <label>Email address</label>
                <div class="input-box" [class.input-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <mat-icon>mail_outline</mat-icon>
                  <input type="email" formControlName="email" placeholder="you@company.com" autocomplete="email">
                </div>
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <span class="field-error">Enter a valid email</span>
                }
              </div>

              <div class="field-wrap">
                <div class="label-row">
                  <label>Password</label>
                  <button type="button" class="link-btn" (click)="showForgot = true">Forgot password?</button>
                </div>
                <div class="input-box" [class.input-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <mat-icon>lock_outline</mat-icon>
                  <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" autocomplete="current-password">
                  <button type="button" class="eye-btn" (click)="showPassword = !showPassword">
                    <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <span class="field-error">Password is required</span>
                }
              </div>

              <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || (isLoading$ | async)">
                @if (isLoading$ | async) {
                  <mat-spinner diameter="20" color="accent"></mat-spinner>
                } @else {
                  Sign in
                }
              </button>
            </form>

            <p class="footer-text">
              Don't have an account?
              <a routerLink="/register" class="link">Create account</a>
            </p>
          </div>
        }

        <!-- ─── FORGOT PASSWORD VIEW ─── -->
        @if (showForgot) {
          <div class="view-forgot">
            @if (!forgotSent) {
              <button type="button" class="back-btn" (click)="showForgot = false">
                <mat-icon>arrow_back</mat-icon> Back to sign in
              </button>
              <h1>Reset password</h1>
              <p class="subtitle">Enter your email and we'll send you a reset link.</p>

              @if (forgotError) {
                <div class="alert alert-error">
                  <mat-icon>error_outline</mat-icon> {{ forgotError }}
                </div>
              }

              <form [formGroup]="forgotForm" (ngSubmit)="onForgotSubmit()" class="auth-form">
                <div class="field-wrap">
                  <label>Email address</label>
                  <div class="input-box" [class.input-error]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched">
                    <mat-icon>mail_outline</mat-icon>
                    <input type="email" formControlName="email" placeholder="you@company.com" autocomplete="email">
                  </div>
                  @if (forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched) {
                    <span class="field-error">Enter a valid email</span>
                  }
                </div>
                <button type="submit" class="btn-primary" [disabled]="forgotForm.invalid || forgotLoading">
                  @if (forgotLoading) {
                    <mat-spinner diameter="20" color="accent"></mat-spinner>
                  } @else {
                    Send reset link
                  }
                </button>
              </form>
            } @else {
              <div class="forgot-success">
                <div class="success-icon">
                  <mat-icon>mark_email_read</mat-icon>
                </div>
                <h2>Check your email</h2>
                <p>If <strong>{{ forgotForm.value.email }}</strong> is registered, a reset link has been sent.</p>
                <button type="button" class="btn-primary" (click)="showForgot = false; forgotSent = false">
                  Back to sign in
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ── Root ── */
    .auth-root {
      min-height: 100vh;
      background: #060B18;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow: hidden;
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    }

    /* ── Background orbs ── */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.35;
      pointer-events: none;
    }
    .orb-left  { width: 480px; height: 480px; background: #4F46E5; top: -160px; left: -180px; }
    .orb-right { width: 400px; height: 400px; background: #06B6D4; bottom: -120px; right: -120px; }

    /* ── Card ── */
    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 20px;
      padding: 40px 40px 36px;
      backdrop-filter: blur(24px);
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    }

    /* ── Logo ── */
    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 32px;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #818CF8, #22D3EE);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Typography ── */
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0 0 6px;
    }
    h2 { font-size: 1.3rem; font-weight: 700; color: #F8FAFC; margin: 0 0 6px; }
    .subtitle {
      color: #94A3B8;
      font-size: 0.9rem;
      margin: 0 0 28px;
    }

    /* ── Form ── */
    .auth-form { display: flex; flex-direction: column; gap: 18px; }
    .field-wrap { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 0.82rem; font-weight: 600; color: #CBD5E1; letter-spacing: 0.02em; }
    .label-row { display: flex; justify-content: space-between; align-items: center; }

    .input-box {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-box:focus-within {
      border-color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
    }
    .input-box.input-error { border-color: #F87171; }
    .input-box mat-icon {
      color: #64748B;
      padding: 0 10px 0 14px;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .input-box input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #F1F5F9;
      font-size: 0.92rem;
      padding: 13px 12px 13px 0;
      font-family: inherit;
    }
    .input-box input::placeholder { color: #475569; }

    .eye-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0 12px;
      color: #64748B;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .eye-btn:hover { color: #94A3B8; }
    .eye-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .field-error { font-size: 0.78rem; color: #F87171; }

    /* ── Alert ── */
    .alert {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 11px 14px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 4px;
    }
    .alert mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
    .alert-error { background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.3); color: #FCA5A5; }
    .alert-pending { background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); color: #FBBF24; }

    /* ── Primary button ── */
    .btn-primary {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #4F46E5, #6366F1);
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 4px;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(79,70,229,0.35);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #4338CA, #4F46E5);
      box-shadow: 0 6px 20px rgba(79,70,229,0.5);
      transform: translateY(-1px);
    }
    .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    /* ── Link button ── */
    .link-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 0.8rem;
      color: #818CF8;
      font-weight: 500;
      font-family: inherit;
      transition: color 0.2s;
    }
    .link-btn:hover { color: #A5B4FC; }

    /* ── Footer ── */
    .footer-text {
      text-align: center;
      margin-top: 22px;
      font-size: 0.85rem;
      color: #64748B;
    }
    .link { color: #818CF8; text-decoration: none; font-weight: 600; margin-left: 4px; }
    .link:hover { color: #A5B4FC; }

    /* ── Back button ── */
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: #818CF8;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      margin-bottom: 20px;
      font-family: inherit;
      transition: color 0.2s;
    }
    .back-btn:hover { color: #A5B4FC; }
    .back-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* ── Forgot success ── */
    .forgot-success {
      text-align: center;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(74,222,128,0.12);
      border: 1.5px solid rgba(74,222,128,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }
    .success-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: #4ADE80; }
    .forgot-success p { color: #94A3B8; font-size: 0.88rem; max-width: 280px; }
    .forgot-success strong { color: #F1F5F9; }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .auth-card { padding: 28px 20px 24px; }
      h1 { font-size: 1.5rem; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotForm: FormGroup;
  showPassword = false;
  showForgot = false;
  forgotSent = false;
  forgotLoading = false;
  forgotError: string | null = null;
  isLoading$;
  error$;
  registeredPending = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.isLoading$ = this.authService.isLoading$;
    this.error$ = this.authService.error$;
    this.route.queryParams.subscribe(params => {
      this.registeredPending = params['registered'] === '1';
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.clearError();
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const user = response.data.user;
            if (user.isSuperAdmin) {
              // Platform super-admin → super-admin dashboard
              this.router.navigate(['/super-admin']);
            } else if (user.isAdmin) {
              // Business owner/admin → main dashboard
              this.router.navigate(['/dashboard']);
            } else {
              // Everyone else (employees) → employee dashboard
              localStorage.setItem('employeeToken', response.data.token);
              localStorage.setItem('employeeId', String(user.employeeId ?? ''));
              localStorage.setItem('employeeName', user.employeeName ?? user.email);
              localStorage.setItem('employeeEmail', user.email);
              this.router.navigate(['/employee-dashboard/overview']);
            }
          }
          // If success:false, the tap already set the error$ — no navigation needed
        },
        error: (err) => {
          // catchError in the service already sets error$ and clears loading
          console.error('Login error:', err);
        }
      });
    }
  }

  onForgotSubmit(): void {
    if (this.forgotForm.invalid) return;
    this.forgotLoading = true;
    this.forgotError = null;
    const { email } = this.forgotForm.value;
    this.http.post(environment.apiUrl + '/auth/forgot-password', { email }).subscribe({
      next: () => { this.forgotLoading = false; this.forgotSent = true; },
      error: () => { this.forgotLoading = false; this.forgotSent = true; }
    });
  }
}
