import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="payment-page">
      <div class="orb orb-left"></div>
      <div class="orb orb-right"></div>

      <div class="content">
        <!-- Trial expired banner -->
        <div class="trial-banner" *ngIf="isTrialExpired">
          <span class="banner-icon">⏰</span>
          <span>Your 30-day free trial has ended. Choose a plan below to continue using AccountEezy.</span>
        </div>

        <!-- Active trial notice -->
        <div class="trial-active" *ngIf="!isTrialExpired && daysLeft > 0">
          <span class="banner-icon">✅</span>
          <span>You have <strong>{{ daysLeft }} day{{ daysLeft === 1 ? '' : 's' }}</strong> remaining in your free trial.</span>
        </div>

        <h1>{{ isTrialExpired ? 'Upgrade to Continue' : 'Choose a Plan' }}</h1>
        <p class="subtitle">{{ isTrialExpired ? 'Your free trial has expired. Subscribe now to regain full access.' : 'Unlock the full power of AccountEezy.' }}</p>

        <div class="plans">
          <!-- Starter Plan -->
          <mat-card class="plan-card">
            <mat-card-content>
              <div class="plan-badge">Starter</div>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">19</span>
                <span class="period">/mo</span>
              </div>
              <ul class="plan-features">
                <li>✓ Up to 10 employees</li>
                <li>✓ Payroll processing</li>
                <li>✓ Basic tax reports</li>
                <li>✓ Email support</li>
              </ul>
              <button mat-raised-button class="btn-plan">Get Started</button>
            </mat-card-content>
          </mat-card>

          <!-- Pro Plan -->
          <mat-card class="plan-card featured">
            <div class="popular-label">Most Popular</div>
            <mat-card-content>
              <div class="plan-badge">Pro</div>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">49</span>
                <span class="period">/mo</span>
              </div>
              <ul class="plan-features">
                <li>✓ Unlimited employees</li>
                <li>✓ Advanced payroll & tax</li>
                <li>✓ SO1 & SO2 reports</li>
                <li>✓ Leave management</li>
                <li>✓ Priority support</li>
              </ul>
              <button mat-raised-button class="btn-plan btn-featured">Upgrade to Pro</button>
            </mat-card-content>
          </mat-card>

          <!-- Enterprise Plan -->
          <mat-card class="plan-card">
            <mat-card-content>
              <div class="plan-badge">Enterprise</div>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">99</span>
                <span class="period">/mo</span>
              </div>
              <ul class="plan-features">
                <li>✓ Everything in Pro</li>
                <li>✓ Multi-business support</li>
                <li>✓ Custom integrations</li>
                <li>✓ Dedicated account manager</li>
              </ul>
              <button mat-raised-button class="btn-plan">Contact Sales</button>
            </mat-card-content>
          </mat-card>
        </div>

        <p class="back-link" *ngIf="!isTrialExpired">
          <a routerLink="/dashboard">← Back to Dashboard</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .payment-page {
      min-height: 100vh;
      background: #060B18;
      position: relative;
      overflow-x: hidden;
    }

    .orb {
      position: fixed; border-radius: 50%;
      filter: blur(130px); opacity: 0.28; pointer-events: none; z-index: 0;
    }
    .orb-left  { width: 560px; height: 560px; background: #4F46E5; top: -200px; left: -200px; }
    .orb-right { width: 440px; height: 440px; background: #06B6D4; bottom: -100px; right: -140px; }

    .content {
      position: relative;
      z-index: 1;
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 2rem;
      text-align: center;
    }

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
      color: #F8FAFC;
      font-weight: 800;
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .subtitle {
      color: #94A3B8;
      font-size: 1.1rem;
      margin-bottom: 3rem;
    }

    .plans {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .plan-card {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      backdrop-filter: blur(16px);
      border-radius: 20px !important;
      padding: 0.5rem;
      position: relative;
      transition: all 0.3s ease;
      text-align: center;
    }

    .plan-card:hover {
      border-color: rgba(99,102,241,0.4) !important;
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    }

    .plan-card.featured {
      border-color: rgba(99,102,241,0.5) !important;
      background: rgba(99,102,241,0.08) !important;
    }

    .popular-label {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, #4F46E5, #06B6D4);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 16px;
      border-radius: 20px;
      white-space: nowrap;
      letter-spacing: 0.04em;
    }

    .plan-badge {
      color: #94A3B8;
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

    .currency { color: #94A3B8; font-size: 1.25rem; margin-top: 0.5rem; }
    .amount { color: #F8FAFC; font-size: 3rem; font-weight: 800; line-height: 1; }
    .period { color: #94A3B8; font-size: 1rem; align-self: flex-end; margin-bottom: 0.5rem; }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
      text-align: left;
    }

    .plan-features li {
      color: #CBD5E1;
      padding: 0.4rem 0;
      font-size: 0.9rem;
    }

    .btn-plan {
      width: 100%;
      background: rgba(255,255,255,0.08) !important;
      color: #F8FAFC !important;
      border-radius: 10px !important;
      padding: 0.6rem 0 !important;
      font-weight: 600 !important;
      transition: all 0.2s ease;
    }

    .btn-plan:hover { background: rgba(255,255,255,0.14) !important; }

    .btn-featured {
      background: linear-gradient(90deg, #4F46E5, #06B6D4) !important;
      color: #fff !important;
    }

    .btn-featured:hover { opacity: 0.88; }

    .back-link a {
      color: #818CF8;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link a:hover { text-decoration: underline; }
  `]
})
export class PaymentPageComponent implements OnInit {
  isTrialExpired = false;
  daysLeft = 0;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isTrialExpired = this.authService.isTrialExpired();
    this.daysLeft = this.authService.getDaysLeftInTrial();

    // Also check query param in case user was redirected
    this.route.queryParams.subscribe(params => {
      if (params['reason'] === 'trial-expired') {
        this.isTrialExpired = true;
      }
    });
  }
}
