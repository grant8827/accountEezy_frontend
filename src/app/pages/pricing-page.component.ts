import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
                  <stop stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">AccountEezy</span>
        </div>
      </div>

      <!-- header -->
      <div class="page-header">
        <span class="section-tag">Pricing</span>
        <h1>Simple, transparent pricing</h1>
        <p>No hidden fees. Upgrade or downgrade at any time.</p>
      </div>

      <!-- cards -->
      <div class="pricing-grid">

        <!-- FREE -->
        <div class="pricing-card">
          <div class="pricing-badge pricing-badge--free">Free</div>
          <div class="pricing-price">
            <span class="price-currency">J$</span>
            <span class="price-amount">0</span>
            <span class="price-period">/mo</span>
          </div>
          <p class="pricing-desc">Perfect for freelancers and micro-businesses getting started.</p>
          <ul class="pricing-features">
            <li>✓ Up to 3 employees</li>
            <li>✓ Basic payroll calculator</li>
            <li>✓ GCT tracking</li>
            <li>✓ Manual SO1 export</li>
            <li class="disabled">✗ SO2 annual reports</li>
            <li class="disabled">✗ Deadline alerts</li>
          </ul>
          <a class="btn btn-outline w-full" [routerLink]="['/register']" [queryParams]="{plan: 'free'}">Get Started Free</a>
        </div>

        <!-- PROFESSIONAL (featured) -->
        <div class="pricing-card pricing-card--featured">
          <div class="pricing-badge pricing-badge--pro">Most Popular</div>
          <div class="pricing-price">
            <span class="price-currency">J$</span>
            <span class="price-amount">4,500</span>
            <span class="price-period">/mo</span>
          </div>
          <p class="pricing-desc">Everything a growing Jamaican business needs to stay compliant.</p>
          <ul class="pricing-features">
            <li>✓ Up to 25 employees</li>
            <li>✓ Full payroll automation</li>
            <li>✓ GCT &amp; income tracking</li>
            <li>✓ SO1 &amp; SO2 reports</li>
            <li>✓ Deadline alerts &amp; reminders</li>
            <li>✓ Priority support</li>
          </ul>
          <a class="btn btn-primary-inv w-full" [routerLink]="['/register']" [queryParams]="{plan: 'pro'}">Start 14-Day Trial</a>
        </div>

        <!-- ENTERPRISE -->
        <div class="pricing-card">
          <div class="pricing-badge pricing-badge--enterprise">Enterprise</div>
          <div class="pricing-price">
            <span class="price-amount price-custom">Custom</span>
          </div>
          <p class="pricing-desc">Tailored for large businesses with multi-entity payroll needs.</p>
          <ul class="pricing-features">
            <li>✓ Unlimited employees</li>
            <li>✓ Multi-company support</li>
            <li>✓ API access</li>
            <li>✓ Dedicated account manager</li>
            <li>✓ Custom integrations</li>
            <li>✓ SLA guarantee</li>
          </ul>
          <a class="btn btn-outline w-full" [routerLink]="['/register']" [queryParams]="{plan: 'enterprise'}">Contact Sales</a>
        </div>

      </div><!-- /pricing-grid -->

      <!-- FAQ row -->
      <div class="faq-row">
        <div class="faq-item">
          <div class="faq-icon">💳</div>
          <h3>No credit card required</h3>
          <p>Start your free plan instantly — no payment info needed until you upgrade.</p>
        </div>
        <div class="faq-item">
          <div class="faq-icon">🔄</div>
          <h3>Cancel anytime</h3>
          <p>Monthly billing with no lock-in. Upgrade, downgrade, or cancel with one click.</p>
        </div>
        <div class="faq-item">
          <div class="faq-icon">🇯🇲</div>
          <h3>Jamaica-first compliance</h3>
          <p>Built specifically for TAJ, NIS, and NHT requirements — always up to date.</p>
        </div>
      </div>

    </div><!-- /pricing-root -->
  `,
  styles: [`
    /* ── Root ── */
    .pricing-root {
      min-height: 100vh;
      background: #060B18;
      position: relative;
      overflow-x: hidden;
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
      padding-bottom: 80px;
    }

    /* ── Orbs ── */
    .orb {
      position: fixed; border-radius: 50%;
      filter: blur(130px); opacity: 0.28; pointer-events: none; z-index: 0;
    }
    .orb-left  { width: 560px; height: 560px; background: #4F46E5; top: -200px; left: -200px; }
    .orb-right { width: 440px; height: 440px; background: #06B6D4; bottom: -100px; right: -140px; }

    /* ── Top bar ── */
    .top-bar {
      position: relative; z-index: 10;
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px 48px;
    }
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: #94A3B8; font-size: 0.875rem; text-decoration: none; transition: color 0.2s;
    }
    .back-link:hover { color: #F1F5F9; }
    .logo-wrap { display: flex; align-items: center; gap: 10px; }
    .logo-icon  { width: 32px; height: 32px; }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text {
      font-size: 1.1rem; font-weight: 700;
      background: linear-gradient(135deg, #818CF8, #22D3EE);
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
      background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
      color: #A5B4FC; font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
    }
    .page-header h1 {
      font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
      color: #F8FAFC; margin: 0 0 12px;
    }
    .page-header p { color: #94A3B8; font-size: 1rem; margin: 0; }

    /* ── Pricing grid ── */
    .pricing-grid {
      position: relative; z-index: 1;
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 28px; max-width: 1100px; margin: 0 auto; padding: 0 32px;
      align-items: start;
    }

    /* ── Cards ── */
    .pricing-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 20px; padding: 36px 32px;
      position: relative; transition: all 0.3s ease;
      backdrop-filter: blur(16px);
    }
    .pricing-card:hover {
      border-color: rgba(99,102,241,0.35);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }

    .pricing-card--featured {
      background: linear-gradient(180deg, #4F46E5 0%, #3730A3 100%);
      border-color: transparent;
      box-shadow: 0 20px 60px rgba(79,70,229,0.5);
      transform: translateY(-12px);
    }
    .pricing-card--featured:hover { transform: translateY(-18px); }

    /* ── Badge ── */
    .pricing-badge {
      display: inline-block; padding: 4px 12px; border-radius: 100px;
      font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em;
      text-transform: uppercase; margin-bottom: 20px;
    }
    .pricing-badge--free       { background: rgba(99,102,241,0.15); color: #818CF8; }
    .pricing-badge--pro        { background: rgba(255,255,255,0.2); color: #fff; }
    .pricing-badge--enterprise { background: rgba(6,182,212,0.15);  color: #22D3EE; }

    /* ── Price ── */
    .pricing-price {
      display: flex; align-items: flex-end; gap: 2px;
      margin-bottom: 12px; line-height: 1;
    }
    .price-currency { font-size: 1.2rem; font-weight: 700; color: #F1F5F9; align-self: flex-start; margin-top: 6px; }
    .price-amount   { font-size: 3rem; font-weight: 900; color: #F1F5F9; }
    .price-period   { font-size: 0.9rem; color: #94A3B8; margin-bottom: 4px; }
    .price-custom   { font-size: 2rem; font-weight: 900; color: #F1F5F9; }

    .pricing-card--featured .price-currency,
    .pricing-card--featured .price-amount,
    .pricing-card--featured .price-period { color: #fff; }
    .pricing-card--featured .price-period { color: rgba(255,255,255,0.65); }

    /* ── Description ── */
    .pricing-desc {
      font-size: 0.875rem; color: #64748B; line-height: 1.6; margin: 0 0 24px;
    }
    .pricing-card--featured .pricing-desc { color: rgba(255,255,255,0.72); }

    /* ── Feature list ── */
    .pricing-features {
      list-style: none; padding: 0; margin: 0 0 28px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .pricing-features li { font-size: 0.875rem; color: #CBD5E1; }
    .pricing-features li.disabled { color: #334155; }
    .pricing-card--featured .pricing-features li { color: rgba(255,255,255,0.85); }
    .pricing-card--featured .pricing-features li.disabled { color: rgba(255,255,255,0.3); }

    /* ── Buttons ── */
    .w-full { display: block; width: 100%; text-align: center; text-decoration: none; }

    .btn-outline {
      padding: 13px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
      border: 1.5px solid rgba(99,102,241,0.4); color: #818CF8;
      background: transparent; cursor: pointer; font-family: inherit;
      transition: all 0.2s; box-sizing: border-box;
    }
    .btn-outline:hover {
      background: rgba(99,102,241,0.1); border-color: #6366F1; color: #A5B4FC;
      transform: translateY(-1px);
    }

    .btn-primary-inv {
      padding: 13px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
      background: #fff; color: #4F46E5; border: none; cursor: pointer;
      font-family: inherit; transition: all 0.2s; box-sizing: border-box;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .btn-primary-inv:hover {
      background: #EEF2FF; transform: translateY(-2px);
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
    .faq-item h3 { font-size: 1rem; font-weight: 700; color: #F1F5F9; margin: 0 0 8px; }
    .faq-item p  { font-size: 0.875rem; color: #64748B; margin: 0; line-height: 1.6; }

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
export class PricingPageComponent {}
