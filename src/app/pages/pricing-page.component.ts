import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PackagePrice, PackagePricingService } from '../services/package-pricing.service';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pricing-root">
      <!-- background orbs -->
      <div class="orb orb-left"></div>
      <div class="orb orb-right"></div>

      <!-- nav back link -->
      <div class="top-bar">
        <a routerLink="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Back to home
        </a>
        <div class="logo-wrap">
          <div class="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="url(#plg1)"/>
              <path d="M9 22L14 10L19 18L22 14L26 22H9Z" fill="white" fill-opacity="0.9"/>
              <defs>
                <linearGradient id="plg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="var(--color-primary)"/><stop offset="1" stop-color="var(--accent-color)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">HRBooks360</span>
        </div>
      </div>

      <!-- header -->
      <div class="page-header">
        <span class="section-tag">Pricing</span>
        <h1>Simple, transparent pricing</h1>
        <p>No hidden fees. Upgrade or downgrade at any time.</p>
      </div>

      <div class="billing-toggle" role="group" aria-label="Billing period">
        <span [class.active-period]="!yearly">Monthly</span>
        <button class="toggle-switch" [class.toggle-switch--on]="yearly" type="button" (click)="yearly = !yearly" [attr.aria-pressed]="yearly">
          <span class="toggle-thumb"></span>
        </button>
        <span [class.active-period]="yearly">
          Yearly
          <span class="save-badge">Save 20%</span>
        </span>
      </div>

      <!-- cards -->
      <div class="pricing-grid">

        <!-- LITE -->
        <div class="pricing-card">
          <div class="pricing-badge pricing-badge--free">Lite</div>
          <div class="pricing-price">
            <span class="price-currency">J$</span>
            <span class="price-amount">{{ planPriceFor('lite', 3500) }}</span>
            <span class="price-period">/{{ yearly ? 'yr' : 'mo' }}</span>
          </div>
          <p class="pricing-desc">For micro-businesses moving payroll and HR out of spreadsheets.</p>
          <ul class="pricing-features">
            <li>✓ Up to 5 employees</li>
            <li>✓ Employee records</li>
            <li>✓ Payroll calculator</li>
            <li>✓ GCT tracking</li>
            <li>✓ Basic dashboard overview</li>
            <li>✓ Email support</li>
          </ul>
          <a class="btn btn-outline w-full" [routerLink]="['/register']" [queryParams]="{plan: 'lite', billing: billingPeriod}">Get Started</a>
        </div>

        <!-- STARTER -->
        <div class="pricing-card pricing-card--featured">
          <div class="pricing-badge pricing-badge--pro">Starter</div>
          <div class="pricing-price">
            <span class="price-currency">J$</span>
            <span class="price-amount">{{ planPriceFor('starter', 6500) }}</span>
            <span class="price-period">/{{ yearly ? 'yr' : 'mo' }}</span>
          </div>
          <p class="pricing-desc">For small teams that need payroll, ledger tracking and HR basics.</p>
          <ul class="pricing-features">
            <li>✓ 6-15 employees</li>
            <li>✓ Full payroll automation</li>
            <li>✓ GCT &amp; income tracking</li>
            <li>✓ SO1 payroll summary</li>
            <li>✓ Leave requests</li>
            <li>✓ Employee portal access</li>
          </ul>
          <a class="btn btn-primary-inv w-full" [routerLink]="['/register']" [queryParams]="{plan: 'starter', billing: billingPeriod}">{{ trialCtaFor('starter') }}</a>
        </div>

        <!-- GROWTH -->
        <div class="pricing-card">
          <div class="pricing-badge pricing-badge--enterprise">Growth</div>
          <div class="pricing-price">
            <span class="price-currency">J$</span>
            <span class="price-amount">{{ planPriceFor('growth', 12500) }}</span>
            <span class="price-period">/{{ yearly ? 'yr' : 'mo' }}</span>
          </div>
          <p class="pricing-desc">For growing companies with more payroll, reporting and support needs.</p>
          <ul class="pricing-features">
            <li>✓ 16-35 employees</li>
            <li>✓ Everything in Starter</li>
            <li>✓ Notices management</li>
            <li>✓ Advanced tax breakdowns</li>
            <li>✓ Priority support</li>
            <li>✓ Export and print workflows</li>
          </ul>
          <a class="btn btn-outline w-full" [routerLink]="['/register']" [queryParams]="{plan: 'growth', billing: billingPeriod}">Get Started</a>
        </div>

        <!-- CUSTOM -->
        <div class="pricing-card">
          <div class="pricing-badge pricing-badge--custom">Custom</div>
          <div class="pricing-price">
            <span class="price-amount price-custom">Custom</span>
          </div>
          <p class="pricing-desc">For teams above 35 employees or businesses with custom onboarding needs.</p>
          <ul class="pricing-features">
            <li>✓ 36+ employees</li>
            <li>✓ From {{ customBasePrice }}</li>
            <li>✓ {{ yearly ? '+ J$1,920 per employee over 35/year' : '+ J$200 per employee over 35/month' }}</li>
            <li>✓ Dedicated account support</li>
            <li>✓ Custom reporting setup</li>
            <li>✓ Multi-business planning</li>
          </ul>
          <a class="btn btn-outline w-full" [routerLink]="['/register']" [queryParams]="{plan: 'custom', billing: billingPeriod}">Contact Sales</a>
        </div>

      </div><!-- /pricing-grid -->

      <!-- FAQ row -->
      <div class="faq-row">
        <div class="faq-item">
          <div class="faq-icon">💳</div>
          <h3>Start small</h3>
          <p>Lite covers up to 5 employees, so micro-businesses can start without overbuying.</p>
        </div>
        <div class="faq-item">
          <div class="faq-icon">🔄</div>
          <h3>Cancel anytime</h3>
          <p>Move from Lite to Starter to Growth as your team crosses each employee cutoff.</p>
        </div>
        <div class="faq-item">
          <div class="faq-icon">🇯🇲</div>
          <h3>Jamaica-first compliance</h3>
          <p>Built around payroll, GCT, SO1 summaries and HR workflows for Jamaican businesses.</p>
        </div>
      </div>

    </div><!-- /pricing-root -->
  `,
  styles: [`
    /* ── Root ── */
    .pricing-root {
      min-height: 100vh;
      background: var(--sidebar-bg);
      position: relative;
      overflow-x: hidden;
      font-family: var(--font-family);
      padding-bottom: 80px;
    }

    /* ── Orbs ── */
    .orb {
      position: fixed; border-radius: 50%;
      filter: blur(130px); opacity: 0.28; pointer-events: none; z-index: 0;
    }
    .orb-left  { width: 560px; height: 560px; background: var(--color-primary); top: -200px; left: -200px; }
    .orb-right { width: 440px; height: 440px; background: var(--accent-color); bottom: -100px; right: -140px; }

    /* ── Top bar ── */
    .top-bar {
      position: relative; z-index: 10;
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px 48px;
    }
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--sidebar-text); font-size: 0.875rem; text-decoration: none; transition: color 0.2s;
    }
    .back-link:hover { color: var(--color-primary-text); }
    .logo-wrap { display: flex; align-items: center; gap: 10px; }
    .logo-icon  { width: 32px; height: 32px; }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text {
      font-size: 1.1rem; font-weight: 700;
      background: linear-gradient(135deg, var(--primary-light), var(--accent-color));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* ── Page header ── */
    .page-header {
      position: relative; z-index: 1;
      text-align: center; padding: 48px 24px 56px;
    }
    .section-tag {
      display: inline-block;
      padding: 4px 14px; border-radius: 100px;
      background: rgba(4,120,87,0.15); border: 1px solid rgba(4,120,87,0.3);
      color: var(--badge-success-bg); font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
    }
    .page-header h1 {
      font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
      color: var(--bg-app); margin: 0 0 12px;
    }
    .page-header p { color: var(--sidebar-text); font-size: 1rem; margin: 0; }

    .billing-toggle {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: -24px auto 48px;
      color: var(--sidebar-text);
      font-size: 0.95rem;
      font-weight: 600;
    }

    .active-period {
      color: var(--color-primary-text);
    }

    .toggle-switch {
      width: 50px;
      height: 28px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 999px;
      background: rgba(255,255,255,0.1);
      padding: 3px;
      cursor: pointer;
      transition: background 150ms ease, border-color 150ms ease;
    }

    .toggle-switch--on {
      background: var(--color-primary);
      border-color: var(--color-primary);
    }

    .toggle-thumb {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--bg-card);
      box-shadow: 0 2px 8px rgba(0,0,0,0.24);
      transition: transform 150ms ease;
    }

    .toggle-switch--on .toggle-thumb {
      transform: translateX(22px);
    }

    .save-badge {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--badge-warning-bg);
      color: var(--badge-warning-text);
      font-size: 0.7rem;
      font-weight: 800;
      vertical-align: middle;
    }

    /* ── Pricing grid ── */
    .pricing-grid {
      position: relative; z-index: 1;
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 22px; max-width: 1280px; margin: 0 auto; padding: 0 32px;
      align-items: start;
    }

    /* ── Cards ── */
    .pricing-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 20px; padding: 32px 24px;
      position: relative; transition: all 0.3s ease;
      backdrop-filter: blur(16px);
    }
    .pricing-card:hover {
      border-color: rgba(4,120,87,0.35);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }

    .pricing-card--featured {
      background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
      border-color: transparent;
      box-shadow: 0 20px 60px rgba(4,120,87,0.5);
      transform: translateY(-12px);
    }
    .pricing-card--featured:hover { transform: translateY(-18px); }

    /* ── Badge ── */
    .pricing-badge {
      display: inline-block; padding: 4px 12px; border-radius: 100px;
      font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em;
      text-transform: uppercase; margin-bottom: 20px;
    }
    .pricing-badge--free       { background: rgba(4,120,87,0.15); color: var(--primary-light); }
    .pricing-badge--pro        { background: rgba(255,255,255,0.2); color: var(--bg-card); }
    .pricing-badge--enterprise { background: rgba(217,119,6,0.15);  color: var(--accent-color); }
    .pricing-badge--custom     { background: var(--badge-warning-bg); color: var(--badge-warning-text); }

    /* ── Price ── */
    .pricing-price {
      display: flex; align-items: flex-end; gap: 2px;
      margin-bottom: 12px; line-height: 1;
    }
    .price-currency { font-size: 1.2rem; font-weight: 700; color: var(--color-primary-text); align-self: flex-start; margin-top: 6px; }
    .price-amount   { font-size: clamp(2.25rem, 4vw, 3rem); font-weight: 900; color: var(--color-primary-text); }
    .price-period   { font-size: 0.9rem; color: var(--sidebar-text); margin-bottom: 4px; }
    .price-custom   { font-size: 2rem; font-weight: 900; color: var(--color-primary-text); }

    .pricing-card--featured .price-currency,
    .pricing-card--featured .price-amount,
    .pricing-card--featured .price-period { color: var(--bg-card); }
    .pricing-card--featured .price-period { color: rgba(255,255,255,0.65); }

    /* ── Description ── */
    .pricing-desc {
      font-size: 0.875rem; color: var(--sidebar-text); line-height: 1.6; margin: 0 0 24px;
    }
    .pricing-card--featured .pricing-desc { color: rgba(255,255,255,0.72); }

    /* ── Feature list ── */
    .pricing-features {
      list-style: none; padding: 0; margin: 0 0 28px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .pricing-features li { font-size: 0.875rem; color: var(--neutral-300); }
    .pricing-features li.disabled { color: var(--neutral-700); }
    .pricing-card--featured .pricing-features li { color: rgba(255,255,255,0.85); }
    .pricing-card--featured .pricing-features li.disabled { color: rgba(255,255,255,0.3); }

    /* ── Buttons ── */
    .w-full { display: block; width: 100%; text-align: center; text-decoration: none; }

    .btn-outline {
      padding: 13px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
      border: 1.5px solid rgba(4,120,87,0.4); color: var(--primary-light);
      background: transparent; cursor: pointer; font-family: inherit;
      transition: all 0.2s; box-sizing: border-box;
    }
    .btn-outline:hover {
      background: rgba(4,120,87,0.1); border-color: var(--color-primary); color: var(--badge-success-bg);
      transform: translateY(-1px);
    }

    .btn-primary-inv {
      padding: 13px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
      background: var(--bg-card); color: var(--color-primary); border: none; cursor: pointer;
      font-family: inherit; transition: all 0.2s; box-sizing: border-box;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .btn-primary-inv:hover {
      background: var(--badge-success-bg); transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    /* ── FAQ row ── */
    .faq-row {
      position: relative; z-index: 1;
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 24px; max-width: 1100px; margin: 56px auto 0; padding: 0 32px;
    }
    .faq-item {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px; padding: 28px 24px; text-align: center;
    }
    .faq-icon { font-size: 2rem; margin-bottom: 12px; }
    .faq-item h3 { font-size: 1rem; font-weight: 700; color: var(--color-primary-text); margin: 0 0 8px; }
    .faq-item p  { font-size: 0.875rem; color: var(--text-muted); margin: 0; line-height: 1.6; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .pricing-grid { grid-template-columns: 1fr; max-width: 480px; }
      .pricing-card--featured { transform: none; }
      .pricing-card--featured:hover { transform: translateY(-4px); }
      .faq-row { grid-template-columns: 1fr; max-width: 480px; }
      .top-bar { padding: 20px 24px; }
    }
    @media (max-width: 480px) {
      .pricing-grid, .faq-row { padding: 0 16px; }
      .page-header { padding: 32px 16px 40px; }
    }
  `]
})
export class PricingPageComponent implements OnInit {
  yearly = false;
  packages: Record<string, PackagePrice> = {};

  constructor(private packagePricing: PackagePricingService) {}

  ngOnInit(): void {
    this.packagePricing.getPackageMap().subscribe({
      next: packages => {
        this.packages = packages;
      },
      error: error => {
        console.error('Failed to load package pricing:', error);
      }
    });
  }

  get billingPeriod(): 'monthly' | 'yearly' {
    return this.yearly ? 'yearly' : 'monthly';
  }

  get customBasePrice(): string {
    return this.yearly
      ? `J$${this.planPriceValue('custom', 15000, 'yearly').toLocaleString('en-US', { maximumFractionDigits: 0 })}/year`
      : `J$${this.planPriceValue('custom', 15000, 'monthly').toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo`;
  }

  planPrice(monthlyPrice: number): string {
    const price = this.yearly ? monthlyPrice * 12 * 0.8 : monthlyPrice;
    return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  planPriceFor(planKey: string, fallbackMonthlyPrice: number): string {
    return this.planPriceValue(planKey, fallbackMonthlyPrice, this.billingPeriod)
      .toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  trialCtaFor(planKey: string): string {
    const days = this.packages[planKey]?.freeTrialDays ?? 14;
    return days > 0 ? `Start ${days}-Day Trial` : 'Get Started';
  }

  private planPriceValue(planKey: string, fallbackMonthlyPrice: number, billing: 'monthly' | 'yearly'): number {
    return this.packagePricing.priceFor(this.packages[planKey], billing, fallbackMonthlyPrice);
  }
}
