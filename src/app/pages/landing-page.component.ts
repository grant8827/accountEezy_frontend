import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="landing-page">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-container">
          <h1 class="logo">AccountEezy</h1>
          <div class="nav-links">
            <a (click)="scrollTo('home')">Home</a>
            <a (click)="scrollTo('about')">About</a>
            <a (click)="scrollTo('pricing')">Pricing</a>
            <a (click)="scrollTo('contact')">Contact</a>
            <a routerLink="/login" mat-button>Login</a>
            <a routerLink="/pricing" mat-raised-button color="primary">Get Started</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section id="home" class="hero">
        <div class="hero-content">
          <h1>Jamaica's Premier Financial Staffing System</h1>
          <p>Streamline your payroll, track employees, and manage finances with ease</p>
          <button mat-raised-button color="primary" routerLink="/register">Start Free Trial</button>
        </div>
      </section>

      <!-- Features Section -->
      <section id="about" class="features">
        <h2>Why Choose AccountEezy?</h2>
        <div class="features-grid">
          <mat-card>
            <mat-icon>people</mat-icon>
            <h3>Employee Management</h3>
            <p>Track and manage all your employees in one place</p>
          </mat-card>
          <mat-card>
            <mat-icon>payment</mat-icon>
            <h3>Payroll Processing</h3>
            <p>Automated payroll calculation and processing</p>
          </mat-card>
          <mat-card>
            <mat-icon>assessment</mat-icon>
            <h3>Financial Reports</h3>
            <p>Generate comprehensive financial reports instantly</p>
          </mat-card>
          <mat-card>
            <mat-icon>security</mat-icon>
            <h3>Secure & Compliant</h3>
            <p>Bank-level security and Jamaica tax compliance</p>
          </mat-card>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="pricing-section">
        <div class="pricing-inner">
          <span class="pricing-tag">Pricing</span>
          <h2>Simple, transparent pricing</h2>
          <p class="pricing-sub">No hidden fees. Cancel anytime.</p>

          <!-- Billing toggle -->
          <div class="billing-toggle">
            <span [class.toggle-active]="!yearly">Monthly</span>
            <button class="toggle-switch" [class.on]="yearly" (click)="yearly = !yearly" type="button">
              <span class="toggle-thumb"></span>
            </button>
            <span [class.toggle-active]="yearly">Yearly <span class="save-badge">Save 20%</span></span>
          </div>

          <!-- Cards -->
          <div class="p-grid">

            <!-- Starter -->
            <div class="p-card">
              <div class="p-badge p-badge--starter">Starter</div>
              <div class="p-price">
                <span class="p-currency">$</span>
                <span class="p-amount">{{ yearly ? (4500 * 0.8 | number:'1.0-0') : '4,500' }}</span>
                <span class="p-period">/{{ yearly ? 'yr' : 'mo' }}</span>
              </div>
              <p class="p-desc">For small teams getting started with payroll.</p>
              <ul class="p-features">
                <li>✓ Up to 10 employees</li>
                <li>✓ Full payroll automation</li>
                <li>✓ GCT &amp; income tracking</li>
                <li>✓ SO1 reports</li>
                <li>✓ Email support</li>
              </ul>
              <a class="p-btn p-btn--outline" routerLink="/register" [queryParams]="{plan: 'starter'}">Get Started</a>
            </div>

            <!-- Growth (featured) -->
            <div class="p-card p-card--featured">
              <div class="p-badge p-badge--growth">Most Popular</div>
              <div class="p-price">
                <span class="p-currency">$</span>
                <span class="p-amount">{{ yearly ? (8500 * 0.8 | number:'1.0-0') : '8,500' }}</span>
                <span class="p-period">/{{ yearly ? 'yr' : 'mo' }}</span>
              </div>
              <p class="p-desc">For growing businesses that need more power.</p>
              <ul class="p-features">
                <li>✓ Up to 25 employees</li>
                <li>✓ Full payroll automation</li>
                <li>✓ GCT &amp; income tracking</li>
                <li>✓ SO1 &amp; SO2 reports</li>
                <li>✓ Deadline alerts &amp; reminders</li>
                <li>✓ Priority support</li>
              </ul>
              <a class="p-btn p-btn--primary" routerLink="/register" [queryParams]="{plan: 'growth'}">Start 14-Day Trial</a>
            </div>

            <!-- Professional -->
            <div class="p-card">
              <div class="p-badge p-badge--pro">Professional</div>
              <div class="p-price">
                <span class="p-currency">$</span>
                <span class="p-amount">{{ yearly ? (14500 * 0.8 | number:'1.0-0') : '14,500' }}</span>
                <span class="p-period">/{{ yearly ? 'yr' : 'mo' }}</span>
              </div>
              <p class="p-desc">For established businesses with larger teams.</p>
              <ul class="p-features">
                <li>✓ Up to 35 employees</li>
                <li>✓ Full payroll automation</li>
                <li>✓ All reports &amp; exports</li>
                <li>✓ Deadline alerts &amp; reminders</li>
                <li>✓ Multi-admin access</li>
                <li>✓ Priority support</li>
              </ul>
              <a class="p-btn p-btn--outline" routerLink="/register" [queryParams]="{plan: 'professional'}">Get Started</a>
            </div>

            <!-- Custom -->
            <div class="p-card p-card--custom">
              <div class="p-badge p-badge--custom">Custom</div>
              <div class="p-price custom-price-wrap">
                <div class="custom-calc">
                  <span class="p-currency">$</span>
                  <span class="p-amount">{{ yearly ? (customPrice * 0.8 | number:'1.0-0') : (customPrice | number:'1.0-0') }}</span>
                  <span class="p-period">/{{ yearly ? 'yr' : 'mo' }}</span>
                </div>
              </div>
              <p class="p-desc">More than 35 employees? Build your own plan.</p>
              <div class="employee-input-wrap">
                <label>Number of employees</label>
                <div class="input-row">
                  <button type="button" class="qty-btn" (click)="decrementEmployees()">−</button>
                  <input type="number" [(ngModel)]="customEmployees" (ngModelChange)="onEmployeesChange($event)" min="36" class="qty-input" />
                  <button type="button" class="qty-btn" (click)="incrementEmployees()">+</button>
                </div>
                <p class="custom-note">Base $14,500 + $200 per employee over 35</p>
              </div>
              <ul class="p-features">
                <li>✓ Unlimited employees</li>
                <li>✓ Everything in Professional</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ Custom integrations</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <a class="p-btn p-btn--outline" routerLink="/register" [queryParams]="{plan: 'custom', employees: customEmployees}">Contact Sales</a>
            </div>

          </div><!-- /p-grid -->
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="contact">
        <h2>Get In Touch</h2>
        <p>Email: support&#64;accounteezy.com</p>
        <p>Phone: +1 (876) 555-0100</p>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 AccountEezy. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      width: 100%;
      min-height: 100vh;
      background: #060B18;
      position: relative;
      overflow-x: hidden;
    }

    .landing-page::before {
      content: '';
      position: fixed;
      top: -200px;
      left: -200px;
      width: 560px;
      height: 560px;
      background: #4F46E5;
      border-radius: 50%;
      filter: blur(130px);
      opacity: 0.28;
      pointer-events: none;
      z-index: 0;
    }

    .landing-page::after {
      content: '';
      position: fixed;
      bottom: -100px;
      right: -140px;
      width: 440px;
      height: 440px;
      background: #06B6D4;
      border-radius: 50%;
      filter: blur(130px);
      opacity: 0.28;
      pointer-events: none;
      z-index: 0;
    }

    .navbar {
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(16px);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .logo {
      background: linear-gradient(135deg, #818CF8, #22D3EE);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      font-size: 1.8rem;
      margin: 0;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      color: #94A3B8;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: #F1F5F9;
    }

    .hero {
      text-align: center;
      padding: 8rem 2rem;
      position: relative;
      z-index: 1;
    }

    .hero-content h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #F8FAFC, #818CF8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-content p {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
      color: #94A3B8;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .features {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #F8FAFC;
      font-weight: 800;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .features-grid mat-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(16px);
      text-align: center;
      padding: 2rem;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .features-grid mat-card:hover {
      border-color: rgba(99,102,241,0.35);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }

    .features-grid mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #4F46E5, #06B6D4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    .features-grid h3 {
      color: #F1F5F9;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .features-grid p {
      color: #64748B;
    }

    .contact {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255,255,255,0.03);
      border-top: 1px solid rgba(255,255,255,0.07);
      position: relative;
      z-index: 1;
    }

    .contact h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #F8FAFC;
      font-weight: 800;
    }

    .contact p {
      font-size: 1.2rem;
      color: #94A3B8;
      margin: 0.5rem 0;
    }

    .footer {
      background: rgba(0,0,0,0.3);
      border-top: 1px solid rgba(255,255,255,0.07);
      text-align: center;
      padding: 2rem;
      position: relative;
      z-index: 1;
    }

    .footer p {
      margin: 0;
      color: #64748B;
    }

    /* ── Pricing Section ── */
    .pricing-section {
      padding: 5rem 2rem;
      position: relative;
      z-index: 1;
    }
    .pricing-inner {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    .pricing-tag {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 100px;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.3);
      color: #A5B4FC;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .pricing-section h2 {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 800;
      color: #F8FAFC;
      margin: 0 0 12px;
    }
    .pricing-sub {
      color: #94A3B8;
      font-size: 1rem;
      margin: 0 0 36px;
    }

    /* ── Billing toggle ── */
    .billing-toggle {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 100px;
      padding: 8px 20px;
      margin-bottom: 48px;
      color: #64748B;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .billing-toggle .toggle-active { color: #F1F5F9; }
    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
      background: rgba(99,102,241,0.25);
      border: 1px solid rgba(99,102,241,0.4);
      border-radius: 100px;
      cursor: pointer;
      transition: background 0.25s;
      padding: 0;
      outline: none;
    }
    .toggle-switch.on {
      background: #4F46E5;
      border-color: #4F46E5;
    }
    .toggle-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: left 0.25s;
    }
    .toggle-switch.on .toggle-thumb { left: 23px; }
    .save-badge {
      display: inline-block;
      background: rgba(16,185,129,0.15);
      border: 1px solid rgba(16,185,129,0.3);
      color: #34D399;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 100px;
      margin-left: 4px;
      letter-spacing: 0.04em;
    }

    /* ── Pricing Grid ── */
    .p-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      align-items: start;
      text-align: left;
    }

    /* ── Card ── */
    .p-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 20px;
      padding: 32px 28px;
      transition: all 0.3s ease;
      backdrop-filter: blur(16px);
    }
    .p-card:hover {
      border-color: rgba(99,102,241,0.35);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }
    .p-card--featured {
      background: linear-gradient(180deg, #4F46E5 0%, #3730A3 100%);
      border-color: transparent;
      box-shadow: 0 20px 60px rgba(79,70,229,0.5);
      transform: translateY(-12px);
    }
    .p-card--featured:hover { transform: translateY(-18px); }
    .p-card--custom {
      border-color: rgba(6,182,212,0.3);
    }

    /* ── Badge ── */
    .p-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .p-badge--starter    { background: rgba(99,102,241,0.15); color: #818CF8; }
    .p-badge--growth     { background: rgba(255,255,255,0.2); color: #fff; }
    .p-badge--pro        { background: rgba(99,102,241,0.15); color: #818CF8; }
    .p-badge--custom     { background: rgba(6,182,212,0.15); color: #22D3EE; }

    /* ── Price ── */
    .p-price {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      margin-bottom: 12px;
      line-height: 1;
    }
    .p-currency { font-size: 1.2rem; font-weight: 700; color: #F1F5F9; align-self: flex-start; margin-top: 6px; }
    .p-amount   { font-size: 2.6rem; font-weight: 900; color: #F1F5F9; }
    .p-period   { font-size: 0.85rem; color: #94A3B8; margin-bottom: 4px; }
    .p-card--featured .p-currency,
    .p-card--featured .p-amount { color: #fff; }
    .p-card--featured .p-period { color: rgba(255,255,255,0.65); }

    /* ── Desc ── */
    .p-desc {
      font-size: 0.875rem;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 20px;
    }
    .p-card--featured .p-desc { color: rgba(255,255,255,0.72); }

    /* ── Features ── */
    .p-features {
      list-style: none;
      padding: 0;
      margin: 0 0 24px;
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .p-features li { font-size: 0.85rem; color: #CBD5E1; }
    .p-card--featured .p-features li { color: rgba(255,255,255,0.85); }

    /* ── Buttons ── */
    .p-btn {
      display: block;
      width: 100%;
      text-align: center;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .p-btn--outline {
      border: 1.5px solid rgba(99,102,241,0.4);
      color: #818CF8;
      background: transparent;
    }
    .p-btn--outline:hover {
      background: rgba(99,102,241,0.1);
      border-color: #6366F1;
      color: #A5B4FC;
      transform: translateY(-1px);
    }
    .p-btn--primary {
      background: #fff;
      color: #4F46E5;
      border: none;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .p-btn--primary:hover {
      background: #EEF2FF;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    /* ── Custom employee input ── */
    .employee-input-wrap {
      margin-bottom: 20px;
    }
    .employee-input-wrap label {
      display: block;
      font-size: 0.8rem;
      color: #94A3B8;
      font-weight: 600;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qty-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(6,182,212,0.4);
      background: rgba(6,182,212,0.1);
      color: #22D3EE;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn:hover {
      background: rgba(6,182,212,0.2);
      border-color: #22D3EE;
    }
    .qty-input {
      width: 64px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      color: #F1F5F9;
      font-size: 1rem;
      font-weight: 700;
      text-align: center;
      padding: 4px 8px;
      outline: none;
    }
    .qty-input::-webkit-outer-spin-button,
    .qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }
    .custom-note {
      font-size: 0.75rem;
      color: #64748B;
      margin: 6px 0 0;
    }
    .custom-price-wrap {
      margin-bottom: 12px;
    }
    .custom-calc {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      line-height: 1;
    }

    @media (max-width: 1100px) {
      .p-grid { grid-template-columns: repeat(2, 1fr); }
      .p-card--featured { transform: none; }
      .p-card--featured:hover { transform: translateY(-4px); }
    }
    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
      }
      .hero {
        padding: 6rem 2rem;
      }
      .p-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class LandingPageComponent {
  yearly = false;
  customEmployees = 36;

  get customPrice(): number {
    const extra = Math.max(0, this.customEmployees - 35);
    return 14500 + extra * 200;
  }

  onEmployeesChange(val: number): void {
    if (val < 36) this.customEmployees = 36;
  }

  incrementEmployees(): void {
    this.customEmployees++;
  }

  decrementEmployees(): void {
    if (this.customEmployees > 36) this.customEmployees--;
  }

  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
