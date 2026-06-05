import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

interface SelectedPlan {
  key: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="payment-page">
      <div class="orb orb-left"></div>
      <div class="orb orb-right"></div>

      <div class="content">
        <div class="top-bar">
          <a routerLink="/pricing" class="back-to-pricing">← Back to pricing</a>
        </div>

        <!-- Trial expired banner -->
        <div class="trial-banner" *ngIf="isTrialExpired">
          <span class="banner-icon">⏰</span>
          <span>Your 30-day free trial has ended. Choose a plan below to continue using HRBooks360.</span>
        </div>

        <!-- Active trial notice -->
        <div class="trial-active" *ngIf="!isTrialExpired && daysLeft > 0">
          <span class="banner-icon">✅</span>
          <span>You have <strong>{{ daysLeft }} day{{ daysLeft === 1 ? '' : 's' }}</strong> remaining in your free trial.</span>
        </div>

        <h1>{{ selectedPlan ? 'Complete Payment' : 'Choose a Package First' }}</h1>
        <p class="subtitle">
          {{ selectedPlan ? 'Review your package, then continue to secure Stripe checkout.' : 'Pick a package before starting checkout.' }}
        </p>

        @if (paymentError) {
          <div class="payment-error">{{ paymentError }}</div>
        }

        @if (selectedPlan) {
          <mat-card class="checkout-card">
            <mat-card-content>
              <div class="plan-badge">{{ selectedPlan.name }}</div>
              <div class="plan-price">
                @if (selectedPlan.price > 0) {
                  <span class="currency">J$</span>
                  <span class="amount">{{ selectedPlan.price | number:'1.0-0' }}</span>
                  <span class="period">/{{ selectedPlan.billing === 'yearly' ? 'yr' : 'mo' }}</span>
                } @else {
                  <span class="amount custom-amount">Custom</span>
                }
              </div>
              <ul class="plan-features">
                <li *ngFor="let feature of selectedPlan.features">✓ {{ feature }}</li>
              </ul>

              @if (selectedPlan.key === 'custom') {
                <p class="custom-note">Custom packages need a quick setup call before payment.</p>
                <a class="btn-plan btn-featured contact-link" href="mailto:sales@hrbooks360.com">Contact Sales</a>
              } @else {
                <button mat-raised-button class="btn-plan btn-featured" type="button" (click)="startCheckout()" [disabled]="loading">
                  {{ loading ? 'Starting checkout...' : 'Continue to Stripe Checkout' }}
                </button>
              }
            </mat-card-content>
          </mat-card>
        } @else {
          <a class="btn-plan btn-featured choose-link" routerLink="/pricing">View Packages</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .payment-page {
      min-height: 100vh;
      background: var(--sidebar-bg);
      position: relative;
      overflow-x: hidden;
    }

    .orb {
      position: fixed; border-radius: 50%;
      filter: blur(130px); opacity: 0.28; pointer-events: none; z-index: 0;
    }
    .orb-left  { width: 560px; height: 560px; background: var(--color-primary); top: -200px; left: -200px; }
    .orb-right { width: 440px; height: 440px; background: var(--accent-color); bottom: -100px; right: -140px; }

    .content {
      position: relative;
      z-index: 1;
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 2rem;
      text-align: center;
    }

    .top-bar {
      text-align: left;
      margin-bottom: 2rem;
    }

    .back-to-pricing {
      color: var(--sidebar-text);
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: 600;
    }

    .back-to-pricing:hover { color: var(--color-primary-text); }

    .trial-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      color: #FCA5A5;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-align: left;
    }

    .trial-active {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      color: #86EFAC;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-align: left;
    }

    .banner-icon { font-size: 1.25rem; flex-shrink: 0; }

    h1 {
      color: var(--bg-app);
      font-weight: 800;
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .subtitle {
      color: var(--sidebar-text);
      font-size: 1.1rem;
      margin-bottom: 3rem;
    }

    .checkout-card {
      width: min(520px, 100%);
      margin: 0 auto 2.5rem;
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      backdrop-filter: blur(16px);
      border-radius: 20px !important;
      padding: 0.5rem;
      position: relative;
      transition: all 0.3s ease;
      text-align: center;
    }

    .checkout-card:hover {
      border-color: rgba(4,120,87,0.4) !important;
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    }

    .plan-badge {
      color: var(--sidebar-text);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .plan-price {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 2px;
      margin-bottom: 1.5rem;
    }

    .currency { color: var(--sidebar-text); font-size: 1.25rem; margin-top: 0.5rem; }
    .amount { color: var(--bg-app); font-size: 3rem; font-weight: 800; line-height: 1; }
    .period { color: var(--sidebar-text); font-size: 1rem; align-self: flex-end; margin-bottom: 0.5rem; }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
      text-align: left;
    }

    .plan-features li {
      color: var(--neutral-300);
      padding: 0.4rem 0;
      font-size: 0.9rem;
    }

    .btn-plan {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.08) !important;
      color: var(--bg-app) !important;
      border-radius: 10px !important;
      padding: 0.6rem 0 !important;
      font-weight: 600 !important;
      transition: all 0.2s ease;
    }

    .btn-plan:hover { background: rgba(255,255,255,0.14) !important; }

    .btn-featured {
      background: linear-gradient(90deg, var(--color-primary), var(--accent-color)) !important;
      color: var(--bg-card) !important;
    }

    .btn-featured:hover { opacity: 0.88; }

    .payment-error {
      width: min(520px, 100%);
      margin: 0 auto 1.5rem;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid rgba(248,113,113,0.3);
      background: rgba(248,113,113,0.12);
      color: #FCA5A5;
      text-align: left;
    }

    .custom-note {
      color: var(--sidebar-text);
      margin: 0 0 1.25rem;
    }

    .contact-link,
    .choose-link {
      text-decoration: none;
    }
  `]
})
export class PaymentPageComponent implements OnInit {
  isTrialExpired = false;
  daysLeft = 0;
  selectedPlan: SelectedPlan | null = null;
  loading = false;
  paymentError: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isTrialExpired = this.authService.isTrialExpired();
    this.daysLeft = this.authService.getDaysLeftInTrial();

    // Also check query param in case user was redirected
    this.route.queryParams.subscribe(params => {
      if (params['reason'] === 'trial-expired') {
        this.isTrialExpired = true;
      }
      this.loadSelectedPlan(params['plan'], params['billing']);
    });
  }

  startCheckout(): void {
    if (!this.selectedPlan || this.selectedPlan.key === 'custom') {
      return;
    }

    this.loading = true;
    this.paymentError = null;

    this.http.post<CheckoutSessionResponse>(`${environment.apiUrl}/payments/create-checkout-session`, {
      plan: this.selectedPlan.key,
      billing: this.selectedPlan.billing,
      customerEmail: localStorage.getItem('registrationEmail') || undefined,
      businessName: localStorage.getItem('registrationBusinessName') || undefined,
      businessId: Number(localStorage.getItem('registrationBusinessId')) || undefined,
      successUrl: `${window.location.origin}/login?registered=1&payment=success`,
      cancelUrl: `${window.location.origin}/payment?plan=${this.selectedPlan.key}&billing=${this.selectedPlan.billing}&payment=cancelled`
    }).subscribe({
      next: (response) => {
        if (response.url) {
          window.location.href = response.url;
          return;
        }
        this.paymentError = 'Stripe did not return a checkout URL.';
        this.loading = false;
      },
      error: (err) => {
        this.paymentError = err.error?.message || 'Could not start Stripe checkout. Please try again.';
        this.loading = false;
      }
    });
  }

  private loadSelectedPlan(planParam?: string, billingParam?: string): void {
    const billing = billingParam === 'yearly' ? 'yearly' : 'monthly';
    const planKey = planParam || localStorage.getItem('selectedPlanKey') || '';
    const planMap: Record<string, SelectedPlan> = {
      lite: { key: 'lite', name: 'Lite', price: this.planPrice(3500, billing), billing, features: ['Up to 5 employees', 'Payroll calculator', 'GCT tracking'] },
      starter: { key: 'starter', name: 'Starter', price: this.planPrice(6500, billing), billing, features: ['6-15 employees', 'Full payroll automation', 'Employee portal access'] },
      growth: { key: 'growth', name: 'Growth', price: this.planPrice(12500, billing), billing, features: ['16-35 employees', 'Advanced tax breakdowns', 'Priority support'] },
      custom: { key: 'custom', name: 'Custom', price: 0, billing, features: ['36+ employees', 'Dedicated account support', 'Custom reporting setup'] }
    };

    this.selectedPlan = planMap[planKey] ?? this.readStoredPlan();
  }

  private readStoredPlan(): SelectedPlan | null {
    const stored = localStorage.getItem('selectedPlan');
    if (!stored) {
      return null;
    }
    try {
      const parsed = JSON.parse(stored) as Omit<SelectedPlan, 'key'>;
      return {
        ...parsed,
        key: localStorage.getItem('selectedPlanKey') || parsed.name.toLowerCase()
      };
    } catch {
      return null;
    }
  }

  private planPrice(monthlyPrice: number, billing: 'monthly' | 'yearly'): number {
    return billing === 'yearly' ? monthlyPrice * 12 * 0.8 : monthlyPrice;
  }
}
