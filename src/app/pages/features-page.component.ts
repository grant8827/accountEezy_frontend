import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../components/header/header.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
  points: string[];
}

@Component({
  selector: 'app-features-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, HeaderComponent],
  template: `
    <app-header></app-header>

    <main class="features-page">
      <section class="hero">
        <div class="hero-inner">
          <span class="eyebrow">Dashboard Features</span>
          <h1>Everything your HR and finance dashboard does, in one workspace.</h1>
          <p>
            HRBooks360 brings employees, payroll, transactions, tax reporting, leave requests,
            notices and employee self-service into a secure operating dashboard for Jamaican
            businesses.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" routerLink="/pricing">Get Started</a>
            <a class="btn btn-outline" routerLink="/pricing">View Pricing</a>
          </div>
        </div>
      </section>

      <section class="module-strip">
        <div class="module-strip-inner">
          <span>Overview</span>
          <span>Employees</span>
          <span>Payroll</span>
          <span>Transactions</span>
          <span>Reports</span>
          <span>Leaves</span>
          <span>Notices</span>
          <span>Employee Portal</span>
        </div>
      </section>

      <section class="features-section">
        <div class="section-heading">
          <span class="eyebrow">Core Modules</span>
          <h2>Built around the actual work your team repeats every month.</h2>
        </div>

        <div class="features-grid">
          <article class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon">
              <mat-icon>{{ feature.icon }}</mat-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <ul>
              <li *ngFor="let point of feature.points">
                <mat-icon>check_circle</mat-icon>
                <span>{{ point }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="workflow-section">
        <div class="workflow-copy">
          <span class="eyebrow">Workflow</span>
          <h2>From employee setup to tax review.</h2>
          <p>
            Add your team, process payroll, record income and expenses, then review dashboard
            summaries before reports are due. Employee self-service reduces routine HR messages
            while administrators keep the full picture.
          </p>
        </div>

        <div class="workflow-list">
          <div class="workflow-step">
            <span>01</span>
            <div>
              <h3>Set up people and business details</h3>
              <p>Capture employee records, company registration details and profile information.</p>
            </div>
          </div>
          <div class="workflow-step">
            <span>02</span>
            <div>
              <h3>Run payroll and track ledger activity</h3>
              <p>Calculate statutory deductions, manage payslips and keep transactions organized.</p>
            </div>
          </div>
          <div class="workflow-step">
            <span>03</span>
            <div>
              <h3>Review obligations and manage HR requests</h3>
              <p>Use SO1 summaries, tax breakdowns, leave requests and notices to stay coordinated.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <h2>Ready to see the dashboard in action?</h2>
        <p>Start with the package that matches your employee count and grow from there.</p>
        <a class="btn btn-primary" routerLink="/pricing">Choose a Package</a>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      font-family: var(--font-family);
      color: var(--text-main);
      background: var(--bg-app);
    }

    .features-page {
      background: var(--bg-app);
      min-height: 100vh;
    }

    .hero {
      background: linear-gradient(135deg, var(--sidebar-bg), var(--sidebar-active-bg));
      color: var(--color-primary-text);
      padding: 96px 32px 88px;
      position: relative;
      overflow: hidden;
    }

    .hero::after {
      content: '';
      position: absolute;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: var(--color-primary);
      filter: blur(130px);
      opacity: 0.22;
      right: -160px;
      top: -180px;
    }

    .hero-inner {
      width: min(1120px, 100%);
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .eyebrow {
      display: inline-flex;
      padding: 5px 14px;
      border-radius: 999px;
      background: rgba(4,120,87,0.16);
      border: 1px solid rgba(4,120,87,0.28);
      color: var(--badge-success-bg);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .hero h1,
    .workflow-copy h2,
    .cta-section h2 {
      margin: 0;
      font-size: clamp(2.2rem, 5vw, 4rem);
      line-height: 1.05;
      letter-spacing: -0.02em;
      font-weight: 900;
    }

    .hero p {
      max-width: 760px;
      margin: 24px 0 0;
      color: var(--sidebar-text);
      line-height: 1.75;
      font-size: 1.08rem;
    }

    .hero-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 34px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-primary-text);
    }

    .btn-primary:hover {
      background: var(--color-primary-hover);
    }

    .btn-outline {
      color: var(--color-primary-text);
      border: 1px solid rgba(255,255,255,0.24);
      background: rgba(255,255,255,0.06);
    }

    .btn-outline:hover {
      border-color: rgba(255,255,255,0.46);
      background: rgba(255,255,255,0.1);
    }

    .module-strip {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      border-top: 1px solid var(--border-color);
      padding: 18px 24px;
    }

    .module-strip-inner {
      width: min(1120px, 100%);
      margin: 0 auto;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .module-strip span {
      padding: 7px 12px;
      border-radius: 999px;
      background: var(--badge-success-bg);
      color: var(--badge-success-text);
      font-size: 0.82rem;
      font-weight: 700;
    }

    .features-section,
    .workflow-section {
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
      padding: 84px 0;
    }

    .section-heading {
      max-width: 760px;
      margin-bottom: 42px;
    }

    .section-heading h2 {
      margin: 0;
      font-size: clamp(1.8rem, 3.5vw, 3rem);
      line-height: 1.1;
      font-weight: 850;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--card-radius);
      padding: 24px;
      min-height: 100%;
      transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(4,120,87,0.34);
      box-shadow: 0 16px 36px rgba(28,25,23,0.08);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--badge-success-bg);
      color: var(--badge-success-text);
      display: grid;
      place-items: center;
      margin-bottom: 18px;
    }

    .feature-icon mat-icon {
      width: 26px;
      height: 26px;
      font-size: 26px;
    }

    .feature-card h3 {
      margin: 0 0 10px;
      font-size: 1.05rem;
    }

    .feature-card p {
      margin: 0 0 18px;
      color: var(--text-muted);
      line-height: 1.65;
      font-size: 0.92rem;
    }

    .feature-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 8px;
    }

    .feature-card li {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      color: var(--text-main);
      font-size: 0.84rem;
      line-height: 1.45;
    }

    .feature-card li mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
      color: var(--color-primary);
      flex: 0 0 auto;
      margin-top: 1px;
    }

    .workflow-section {
      display: grid;
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
      gap: 56px;
      align-items: start;
      border-top: 1px solid var(--border-color);
    }

    .workflow-copy h2 {
      color: var(--text-main);
      font-size: clamp(1.8rem, 3vw, 2.8rem);
    }

    .workflow-copy p {
      color: var(--text-muted);
      line-height: 1.75;
      margin: 20px 0 0;
    }

    .workflow-list {
      display: grid;
      gap: 16px;
    }

    .workflow-step {
      display: grid;
      grid-template-columns: 58px 1fr;
      gap: 18px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--card-radius);
      padding: 22px;
    }

    .workflow-step > span {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--sidebar-bg);
      color: var(--color-primary-text);
      font-weight: 900;
    }

    .workflow-step h3 {
      margin: 0 0 8px;
      font-size: 1rem;
    }

    .workflow-step p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .cta-section {
      text-align: center;
      background: var(--sidebar-bg);
      color: var(--color-primary-text);
      padding: 82px 24px;
    }

    .cta-section h2 {
      font-size: clamp(1.8rem, 3vw, 2.8rem);
    }

    .cta-section p {
      color: var(--sidebar-text);
      margin: 16px auto 28px;
      max-width: 620px;
      line-height: 1.7;
    }

    @media (max-width: 1080px) {
      .features-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 760px) {
      .hero {
        padding: 72px 20px;
      }

      .features-grid,
      .workflow-section {
        grid-template-columns: 1fr;
      }

      .features-section,
      .workflow-section {
        padding: 60px 0;
      }
    }
  `]
})
export class FeaturesPageComponent {
  features: Feature[] = [
    {
      icon: 'dashboard',
      title: 'Business Overview',
      description: 'A real-time dashboard for financial health and compliance readiness.',
      points: ['Net profit KPI', 'Tax liabilities', 'Cash flow', 'GCT liability']
    },
    {
      icon: 'groups',
      title: 'Employee Records',
      description: 'Centralize the people data your payroll and HR workflows depend on.',
      points: ['Employee profiles', 'Salary details', 'Employment status', 'Leave history']
    },
    {
      icon: 'payments',
      title: 'Payroll Processing',
      description: 'Calculate statutory deductions and prepare payroll outputs with less manual work.',
      points: ['NIS, NHT, PAYE', 'Education Tax', 'Payslip support', 'Employer cost view']
    },
    {
      icon: 'receipt_long',
      title: 'Transaction Ledger',
      description: 'Track income and expenses with exportable ledger records.',
      points: ['Income and expenses', 'GCT toggle', 'Frequency filters', 'CSV and print export']
    },
    {
      icon: 'account_balance',
      title: 'Reports & Tax',
      description: 'Review statutory obligations before deadlines and monthly submissions.',
      points: ['SO1 payroll summary', 'Tax breakdowns', 'Compliance checklist', 'GCT payable']
    },
    {
      icon: 'event_available',
      title: 'Leave Requests',
      description: 'Manage employee leave requests from submission through approval.',
      points: ['Pending requests', 'Approval states', 'Admin notes', 'Printable records']
    },
    {
      icon: 'notifications',
      title: 'Notices',
      description: 'Share internal updates and employee communications from the dashboard.',
      points: ['Company notices', 'Priority markers', 'Employee visibility', 'Central communication']
    },
    {
      icon: 'badge',
      title: 'Employee Portal',
      description: 'Give employees controlled self-service access to their HR information.',
      points: ['Payslip access', 'Leave applications', 'Notice viewing', 'Profile information']
    }
  ];
}
