import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

interface BusinessRow {
  id: number;
  companyName: string;
  trn: string;
  sector: string;
  businessType: string;
  status: string | number;
  paymentStatus?: string | number | null;
  subscriptionStatus?: string | number | null;
  selectedPlan?: string | null;
  billingPeriod?: string | null;
  paymentCompletedAt?: string | null;
  nextPaymentDueAt?: string | null;
  gracePeriodEndsAt?: string | null;
  lastPaymentMethod?: string | null;
  trialStartDate: string;
  businessEmail: string;
  businessPhone: string;
  parish: string;
  country: string;
  ownerName: string;
  ownerEmail: string;
  employeeCount: number;
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  deactivated: number;
}

interface PackageRow {
  id: number;
  key: string;
  name: string;
  monthlyPriceJmd: number;
  yearlyPriceJmd?: number | null;
  isCustom: boolean;
  discountEnabled: boolean;
  discountPercent: number;
  monthlySaleEnabled: boolean;
  monthlySalePriceJmd?: number | null;
  yearlySaleEnabled: boolean;
  yearlySalePriceJmd?: number | null;
  freeTrialDays: number;
  discountedMonthlyPriceJmd: number;
  regularYearlyPriceJmd: number;
  discountedYearlyPriceJmd: number;
  updatedAt: string;
}

interface UserLookupResult {
  appUser: {
    id: string;
    email: string;
    userName: string;
    businessId: number | null;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    emailConfirmed: boolean;
    business: {
      id: number;
      companyName: string;
      status: string;
      trn: string;
      businessEmail: string;
      paymentStatus: string;
      subscriptionStatus: string;
      selectedPlan: string | null;
      billingPeriod: string | null;
    } | null;
  } | null;
  employee: {
    id: number;
    name: string;
    email: string;
    businessId: number;
    isActive: boolean;
  } | null;
  loginExpectation: string;
}

type EditableBusinessStatus = 'Active' | 'Suspended' | 'Deactivated';

const businessStatusLabels: Record<number, string> = {
  0: 'Pending',
  1: 'Active',
  2: 'Suspended',
  3: 'Deactivated'
};

const paymentStatusLabels: Record<number, string> = {
  0: 'Unpaid',
  1: 'Paid',
  2: 'PaymentFailed'
};

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="sa-root">
      <!-- Header -->
      <div class="sa-header">
        <div class="sa-logo">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <rect width="32" height="32" rx="10" fill="url(#lg1)"/>
            <path d="M9 22L14 10L19 18L22 14L26 22H9Z" fill="white" fill-opacity="0.9"/>
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--color-primary)"/><stop offset="1" stop-color="var(--accent-color)"/>
              </linearGradient>
            </defs>
          </svg>
          <span>HRBooks360 <span class="sa-badge">Super Admin</span></span>
        </div>
        <button class="btn-logout" (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </div>

      <div class="sa-body">
        <h1>Platform Dashboard</h1>

        <div class="tab-bar" role="tablist" aria-label="Super admin sections">
          <button type="button" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">
            <mat-icon>groups</mat-icon>
            Users
          </button>
          <button type="button" [class.active]="activeTab === 'packages'" (click)="activeTab = 'packages'">
            <mat-icon>sell</mat-icon>
            Packages
          </button>
        </div>

        @if (activeTab === 'users') {
        <!-- Stats cards -->
        <div class="stats-grid" *ngIf="stats">
          <div class="stat-card">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">Total Businesses</span>
          </div>
          <div class="stat-card active">
            <span class="stat-value">{{ stats.active }}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat-card pending">
            <span class="stat-value">{{ stats.pending }}</span>
            <span class="stat-label">Pending Approval</span>
          </div>
          <div class="stat-card suspended">
            <span class="stat-value">{{ stats.suspended }}</span>
            <span class="stat-label">Suspended</span>
          </div>
          <div class="stat-card deactivated">
            <span class="stat-value">{{ stats.deactivated }}</span>
            <span class="stat-label">Deactivated</span>
          </div>
        </div>

        <div class="lookup-panel">
          <div class="lookup-copy">
            <h2>User Lookup</h2>
            <p>Check an email against the app user, employee, and linked business status.</p>
          </div>
          <div class="lookup-form">
            <input class="search-input" [(ngModel)]="userLookupEmail" (keyup.enter)="lookupUser()" placeholder="Enter user email..." />
            <button class="btn-refresh" type="button" (click)="lookupUser()" [disabled]="userLookupLoading">
              <mat-icon>search</mat-icon>
              {{ userLookupLoading ? 'Checking...' : 'Check User' }}
            </button>
          </div>

          <div class="alert-error lookup-error" *ngIf="userLookupError">{{ userLookupError }}</div>

          <div class="lookup-result" *ngIf="userLookupResult">
            <div class="lookup-status">
              <span class="status-pill"
                [class.pill-active]="lookupBusinessStatus === 'Active' || userLookupResult.appUser?.isSuperAdmin || userLookupResult.employee?.isActive"
                [class.pill-pending]="lookupBusinessStatus === 'Pending'"
                [class.pill-suspended]="lookupBusinessStatus === 'Suspended' || userLookupResult.employee?.isActive === false"
                [class.pill-deactivated]="lookupBusinessStatus === 'Deactivated'">
                {{ lookupBusinessStatus || (userLookupResult.employee?.isActive ? 'Employee Active' : 'Found') }}
              </span>
              <strong>{{ userLookupResult.loginExpectation }}</strong>
            </div>

            <div class="lookup-grid">
              <div>
                <span class="lookup-label">App User</span>
                <p>{{ userLookupResult.appUser?.email || 'Not found' }}</p>
                <small *ngIf="userLookupResult.appUser">
                  Admin: {{ userLookupResult.appUser.isAdmin ? 'Yes' : 'No' }} · Super Admin: {{ userLookupResult.appUser.isSuperAdmin ? 'Yes' : 'No' }}
                </small>
              </div>
              <div>
                <span class="lookup-label">Business</span>
                <p>{{ userLookupResult.appUser?.business?.companyName || 'No linked business' }}</p>
                <small *ngIf="userLookupResult.appUser?.business">
                  TRN: {{ userLookupResult.appUser?.business?.trn }} · Payment: {{ userLookupResult.appUser?.business?.paymentStatus }}
                </small>
              </div>
              <div>
                <span class="lookup-label">Employee</span>
                <p>{{ userLookupResult.employee?.name || 'Not found' }}</p>
                <small *ngIf="userLookupResult.employee">
                  Active: {{ userLookupResult.employee.isActive ? 'Yes' : 'No' }} · Business ID: {{ userLookupResult.employee.businessId }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter + search -->
        <div class="table-toolbar">
          <input class="search-input" [(ngModel)]="searchTerm" placeholder="Search by name, email or TRN..." />
          <div class="filter-tabs">
            <button [class.active]="filterStatus === 'All'" (click)="filterStatus = 'All'">All</button>
            <button [class.active]="filterStatus === 'Pending'" (click)="filterStatus = 'Pending'">Pending</button>
            <button [class.active]="filterStatus === 'Active'" (click)="filterStatus = 'Active'">Active</button>
            <button [class.active]="filterStatus === 'Suspended'" (click)="filterStatus = 'Suspended'">Suspended</button>
            <button [class.active]="filterStatus === 'Deactivated'" (click)="filterStatus = 'Deactivated'">Deactivated</button>
          </div>
        </div>

        <!-- Error / loading -->
        <div class="alert-error" *ngIf="error">{{ error }}</div>
        <div class="loading" *ngIf="loading">Loading...</div>

        <!-- Businesses table -->
        <div class="table-wrap" *ngIf="!loading">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Owner</th>
                <th>TRN</th>
                <th>Sector</th>
                <th>Employees</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let biz of filteredBusinesses">
                <td>
                  <div class="company-name">{{ biz.companyName }}</div>
                  <div class="company-sub">{{ biz.businessEmail }}</div>
                </td>
                <td>
                  <div>{{ biz.ownerName || '—' }}</div>
                  <div class="company-sub">{{ biz.ownerEmail }}</div>
                </td>
                <td>{{ biz.trn }}</td>
                <td>{{ biz.sector }}</td>
                <td class="text-center">{{ biz.employeeCount }}</td>
                <td>{{ biz.trialStartDate | date:'mediumDate' }}</td>
                <td>
                  <span class="status-pill" [class]="statusPillClass(biz.status)">
                    {{ statusLabel(biz.status) }}
                  </span>
                </td>
                <td>
                  <span class="status-pill" [class]="paymentPillClass(biz.paymentStatus)">
                    {{ paymentStatusLabel(biz.paymentStatus) }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn-edit"
                      type="button"
                      (click)="openStatusEditor(biz)"
                      [disabled]="actionLoading === biz.id">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredBusinesses.length === 0">
                <td colspan="9" class="empty-row">No businesses found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="status-editor-overlay" *ngIf="statusEditorBusiness" (click)="closeStatusEditor()">
          <div class="status-editor-dialog" (click)="$event.stopPropagation()">
            <div class="status-editor-header">
              <div>
                <h2>Edit Account Status</h2>
                <p>{{ statusEditorBusiness.companyName }}</p>
              </div>
              <button class="status-editor-close" type="button" (click)="closeStatusEditor()" aria-label="Close status editor">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="status-editor-body">
              <div class="status-editor-current">
                <span class="lookup-label">Current Status</span>
                <span class="status-pill" [class]="statusPillClass(statusEditorBusiness.status)">
                  {{ statusLabel(statusEditorBusiness.status) }}
                </span>
                <span class="status-pill" [class]="paymentPillClass(statusEditorBusiness.paymentStatus)">
                  {{ paymentStatusLabel(statusEditorBusiness.paymentStatus) }}
                </span>
              </div>

              <div class="status-editor-actions">
                <button
                  type="button"
                  class="status-choice active"
                  [class.is-selected]="statusLabel(statusEditorBusiness.status) === 'Active'"
                  [disabled]="actionLoading === statusEditorBusiness.id || statusLabel(statusEditorBusiness.status) === 'Active'"
                  (click)="activate(statusEditorBusiness)">
                  Activate
                </button>
                <button
                  type="button"
                  class="status-choice suspended"
                  [class.is-selected]="statusLabel(statusEditorBusiness.status) === 'Suspended'"
                  [disabled]="actionLoading === statusEditorBusiness.id || statusLabel(statusEditorBusiness.status) === 'Suspended'"
                  (click)="suspend(statusEditorBusiness)">
                  Suspend
                </button>
                <button
                  type="button"
                  class="status-choice deactivated"
                  [class.is-selected]="statusLabel(statusEditorBusiness.status) === 'Deactivated'"
                  [disabled]="actionLoading === statusEditorBusiness.id || statusLabel(statusEditorBusiness.status) === 'Deactivated'"
                  (click)="deactivate(statusEditorBusiness)">
                  Deactivate
                </button>
              </div>

              <div class="subscription-form">
                <label>
                  <span>Package</span>
                  <select [(ngModel)]="editorSelectedPlan">
                    <option value="lite">Lite</option>
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>

                <label>
                  <span>Billing</span>
                  <select [(ngModel)]="editorBillingPeriod">
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </label>

                <label>
                  <span>Payment</span>
                  <select [(ngModel)]="editorPaymentStatus">
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </label>

                <button class="btn-save" type="button" (click)="saveBusinessSubscription()" [disabled]="actionLoading === statusEditorBusiness.id">
                  {{ actionLoading === statusEditorBusiness.id ? 'Saving...' : 'Save Subscription' }}
                </button>
              </div>

              <div class="subscription-dates">
                <div>
                  <span class="lookup-label">Last Payment</span>
                  <p>{{ statusEditorBusiness.paymentCompletedAt ? (statusEditorBusiness.paymentCompletedAt | date:'mediumDate') : 'Not paid' }}</p>
                </div>
                <div>
                  <span class="lookup-label">Next Due</span>
                  <p>{{ statusEditorBusiness.nextPaymentDueAt ? (statusEditorBusiness.nextPaymentDueAt | date:'mediumDate') : 'Not set' }}</p>
                </div>
                <div>
                  <span class="lookup-label">Grace Ends</span>
                  <p>{{ statusEditorBusiness.gracePeriodEndsAt ? (statusEditorBusiness.gracePeriodEndsAt | date:'mediumDate') : 'Not set' }}</p>
                </div>
              </div>

              <p class="status-editor-help">Marking Paid activates the account and sets the next due date. Monthly is due in 30 days; yearly is due in 1 year. A 7-day grace window is added automatically.</p>
            </div>
          </div>
        </div>
        }

        @if (activeTab === 'packages') {
        <div class="packages-panel">
          <div class="panel-heading">
            <div>
              <h2>Package Pricing</h2>
              <p>Update regular package prices and add monthly or yearly sale prices. Public pricing and checkout use these values.</p>
            </div>
            <button class="btn-refresh" type="button" (click)="loadPackages()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>

          <div class="alert-error" *ngIf="packageError">{{ packageError }}</div>
          <div class="loading" *ngIf="packagesLoading">Loading packages...</div>

          <div class="package-grid" *ngIf="!packagesLoading">
            <article class="package-card" *ngFor="let pkg of packages">
              <div class="package-top">
                <div>
                  <span class="package-key">{{ pkg.key }}</span>
                  <h3>{{ pkg.name }}</h3>
                </div>
                <span class="status-pill" [class.pill-active]="pkg.monthlySaleEnabled || pkg.yearlySaleEnabled" [class.pill-pending]="!pkg.monthlySaleEnabled && !pkg.yearlySaleEnabled">
                  {{ pkg.monthlySaleEnabled || pkg.yearlySaleEnabled ? 'Sale Active' : 'Regular Price' }}
                </span>
              </div>

              <div class="price-row">
                <span class="old-price" [class.is-discounted]="pkg.monthlySaleEnabled">{{ formatCurrency(pkg.monthlyPriceJmd) }}</span>
                <span class="new-price">{{ formatCurrency(pkg.discountedMonthlyPriceJmd) }}</span>
                <span class="price-period">/mo</span>
              </div>
              <div class="price-row compact-price">
                <span class="old-price" [class.is-discounted]="pkg.yearlySaleEnabled">{{ formatCurrency(pkg.regularYearlyPriceJmd) }}</span>
                <span class="new-price">{{ formatCurrency(pkg.discountedYearlyPriceJmd) }}</span>
                <span class="price-period">/yr</span>
              </div>

              <label class="discount-field">
                <span>Regular monthly price</span>
                <input type="number" min="1" step="1" [(ngModel)]="pkg.monthlyPriceJmd">
              </label>

              <label class="discount-field">
                <span>Regular yearly price</span>
                <input type="number" min="1" step="1" [(ngModel)]="pkg.yearlyPriceJmd" placeholder="Auto: monthly x 12 less 20%">
              </label>

              <label class="toggle-row">
                <input type="checkbox" [(ngModel)]="pkg.monthlySaleEnabled">
                <span>Monthly sale</span>
              </label>

              <label class="discount-field">
                <span>Monthly sale price</span>
                <input type="number" min="1" step="1" [(ngModel)]="pkg.monthlySalePriceJmd" [disabled]="!pkg.monthlySaleEnabled">
              </label>

              <label class="toggle-row">
                <input type="checkbox" [(ngModel)]="pkg.yearlySaleEnabled">
                <span>Yearly sale</span>
              </label>

              <label class="discount-field">
                <span>Yearly sale price</span>
                <input type="number" min="1" step="1" [(ngModel)]="pkg.yearlySalePriceJmd" [disabled]="!pkg.yearlySaleEnabled">
              </label>

              <label class="discount-field">
                <span>Free trial days</span>
                <input type="number" min="0" step="1" [(ngModel)]="pkg.freeTrialDays">
              </label>

              <button class="btn-save" type="button" (click)="savePackagePricing(pkg)" [disabled]="packageActionLoading === pkg.id">
                {{ packageActionLoading === pkg.id ? 'Saving...' : 'Save Package' }}
              </button>
            </article>
          </div>
        </div>
        }
      </div>

      <!-- Toast notification -->
      <div class="toast" [class.toast--visible]="toast.visible">
        <mat-icon>check_circle</mat-icon>
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .sa-root {
      min-height: 100vh;
      background: #060B18;
      color: #F1F5F9;
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    }

    /* Header */
    .sa-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 32px;
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .sa-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #F1F5F9;
    }
    .sa-badge {
      background: linear-gradient(135deg, var(--color-primary), var(--accent-color));
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-left: 6px;
    }
    .btn-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: #94A3B8;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.88rem;
      transition: background 0.2s;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.10); color: #F1F5F9; }

    /* Body */
    .sa-body {
      max-width: 1300px;
      margin: 0 auto;
      padding: 36px 32px;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 28px;
      color: #F1F5F9;
    }

    .tab-bar {
      display: inline-flex;
      gap: 6px;
      padding: 5px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
      margin-bottom: 28px;
    }
    .tab-bar button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: #94A3B8;
      padding: 10px 16px;
      font-weight: 700;
      cursor: pointer;
    }
    .tab-bar button.active {
      background: rgba(4,120,87,0.22);
      color: #F1F5F9;
    }
    .tab-bar mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-card.active  { border-color: rgba(74,222,128,0.3); background: rgba(74,222,128,0.05); }
    .stat-card.pending { border-color: rgba(251,191,36,0.3); background: rgba(251,191,36,0.05); }
    .stat-card.suspended { border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.05); }
    .stat-card.deactivated { border-color: rgba(148,163,184,0.3); background: rgba(148,163,184,0.05); }
    .stat-value { font-size: 2rem; font-weight: 700; color: #F1F5F9; }
    .stat-card.active .stat-value  { color: #4ADE80; }
    .stat-card.pending .stat-value { color: #FBBF24; }
    .stat-card.suspended .stat-value { color: #F87171; }
    .stat-card.deactivated .stat-value { color: #94A3B8; }
    .stat-label { font-size: 0.82rem; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; }

    /* Toolbar */
    .table-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      min-width: 220px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 10px 14px;
      color: #F1F5F9;
      font-size: 0.9rem;
      outline: none;
    }
    .search-input::placeholder { color: #475569; }
    .filter-tabs {
      display: flex;
      gap: 4px;
    }
    .filter-tabs button {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: #64748B;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.15s;
    }
    .filter-tabs button.active,
    .filter-tabs button:hover {
      background: rgba(4,120,87,0.2);
      border-color: rgba(4,120,87,0.5);
      color: #A5B4FC;
    }

    /* Table */
    .table-wrap {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: rgba(255,255,255,0.04); }
    th {
      padding: 12px 16px;
      text-align: left;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #475569;
      font-weight: 600;
    }
    td {
      padding: 14px 16px;
      font-size: 0.88rem;
      color: #CBD5E1;
      border-top: 1px solid rgba(255,255,255,0.05);
      vertical-align: middle;
    }
    tr:hover td { background: rgba(255,255,255,0.02); }
    .company-name { font-weight: 600; color: #F1F5F9; }
    .company-sub { font-size: 0.78rem; color: #475569; margin-top: 2px; }
    .text-center { text-align: center; }
    .empty-row { text-align: center; color: #475569; padding: 40px; }

    /* Status pills */
    .status-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .pill-active   { background: rgba(74,222,128,0.15); color: #4ADE80; border: 1px solid rgba(74,222,128,0.3); }
    .pill-pending  { background: rgba(251,191,36,0.15); color: #FBBF24; border: 1px solid rgba(251,191,36,0.3); }
    .pill-suspended { background: rgba(248,113,113,0.15); color: #F87171; border: 1px solid rgba(248,113,113,0.3); }
    .pill-deactivated { background: rgba(148,163,184,0.14); color: #CBD5E1; border: 1px solid rgba(148,163,184,0.3); }

    /* Action buttons */
    .action-btns { display: flex; flex-wrap: wrap; gap: 8px; }
    .btn-edit {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn-edit:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-edit {
      background: rgba(59,130,246,0.14);
      color: #BFDBFE;
      border: 1px solid rgba(59,130,246,0.3);
    }
    .btn-edit:hover:not(:disabled) { background: rgba(59,130,246,0.24); }

    .status-editor-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 1000;
    }
    .status-editor-dialog {
      width: min(100%, 560px);
      background: #0F172A;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 18px;
      box-shadow: 0 28px 70px rgba(0,0,0,0.45);
      overflow: hidden;
    }
    .status-editor-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 22px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .status-editor-header h2 {
      font-size: 1.1rem;
      margin-bottom: 4px;
    }
    .status-editor-header p {
      color: #94A3B8;
      font-size: 0.9rem;
    }
    .status-editor-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: #CBD5E1;
      cursor: pointer;
    }
    .status-editor-body {
      padding: 20px 22px 22px;
      display: grid;
      gap: 18px;
    }
    .status-editor-current {
      display: grid;
      gap: 8px;
    }
    .status-editor-actions {
      display: grid;
      gap: 10px;
    }
    .status-choice {
      width: 100%;
      text-align: left;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: #E2E8F0;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, opacity 0.15s;
    }
    .status-choice.active {
      border-color: rgba(74,222,128,0.35);
      color: #4ADE80;
    }
    .status-choice.suspended {
      border-color: rgba(248,113,113,0.35);
      color: #F87171;
    }
    .status-choice.deactivated {
      border-color: rgba(148,163,184,0.35);
      color: #CBD5E1;
    }
    .status-choice.is-selected {
      background: rgba(255,255,255,0.08);
      box-shadow: inset 0 0 0 1px currentColor;
    }
    .status-choice:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .status-editor-help {
      color: #94A3B8;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .subscription-form {
      display: grid;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .subscription-form label {
      display: grid;
      gap: 7px;
      color: #CBD5E1;
      font-size: 0.88rem;
      font-weight: 700;
    }
    .subscription-form select {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #F1F5F9;
      border-radius: 8px;
      padding: 10px 12px;
      outline: none;
    }
    .subscription-form option {
      background: #0F172A;
      color: #F1F5F9;
    }
    .subscription-dates {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .subscription-dates > div {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 10px;
    }
    .subscription-dates p {
      color: #E2E8F0;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .alert-error {
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.3);
      color: #F87171;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.88rem;
    }
    .loading { color: #64748B; padding: 40px; text-align: center; }

    .lookup-panel {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 18px;
    }
    .lookup-copy {
      margin-bottom: 14px;
    }
    .lookup-copy h2 {
      font-size: 1.05rem;
      margin-bottom: 4px;
      color: #F1F5F9;
    }
    .lookup-copy p,
    .lookup-result small {
      color: #94A3B8;
      font-size: 0.85rem;
    }
    .lookup-form {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      gap: 12px;
      align-items: center;
    }
    .lookup-error {
      margin-top: 14px;
      margin-bottom: 0;
    }
    .lookup-result {
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-top: 16px;
      padding-top: 16px;
    }
    .lookup-status {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      color: #F1F5F9;
    }
    .lookup-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .lookup-grid > div {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 12px;
    }
    .lookup-label {
      display: block;
      color: #64748B;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .lookup-grid p {
      color: #F1F5F9;
      font-weight: 700;
      margin-bottom: 4px;
      overflow-wrap: anywhere;
    }

    .packages-panel {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 22px;
    }
    .panel-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 22px;
    }
    .panel-heading h2 {
      font-size: 1.25rem;
      margin-bottom: 6px;
    }
    .panel-heading p {
      color: #94A3B8;
      font-size: 0.9rem;
    }
    .btn-refresh,
    .btn-save {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 8px;
      border: 1px solid rgba(4,120,87,0.45);
      background: rgba(4,120,87,0.18);
      color: #A7F3D0;
      padding: 9px 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-save {
      width: 100%;
      margin-top: 4px;
    }
    .btn-save:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .package-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    .package-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 18px;
    }
    .package-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    .package-key {
      color: #94A3B8;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .package-card h3 {
      font-size: 1.25rem;
      margin-top: 4px;
    }
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 18px;
    }
    .old-price {
      color: #94A3B8;
      font-size: 0.95rem;
    }
    .old-price.is-discounted {
      text-decoration: line-through;
      color: #F87171;
    }
    .new-price {
      color: #F1F5F9;
      font-size: 1.6rem;
      font-weight: 800;
    }
    .price-period {
      color: #94A3B8;
    }
    .toggle-row,
    .discount-field {
      display: grid;
      gap: 7px;
      color: #CBD5E1;
      font-size: 0.88rem;
      margin-bottom: 14px;
    }
    .toggle-row {
      grid-template-columns: auto 1fr;
      align-items: center;
    }
    .discount-field input {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #F1F5F9;
      border-radius: 8px;
      padding: 10px 12px;
      outline: none;
    }

    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .lookup-grid { grid-template-columns: 1fr; }
      .subscription-dates { grid-template-columns: 1fr; }
      .sa-body { padding: 20px 16px; }
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .table-toolbar { flex-direction: column; align-items: stretch; }
      .lookup-form { grid-template-columns: 1fr; }
      .panel-heading { flex-direction: column; }
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 32px;
      right: 32px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #047857;
      color: #fff;
      padding: 13px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 4px 24px rgba(0,0,0,0.35);
      transform: translateY(80px);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
      z-index: 9999;
      pointer-events: none;
    }
    .toast mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .toast--visible { transform: translateY(0); opacity: 1; }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  stats: Stats | null = null;
  businesses: BusinessRow[] = [];
  packages: PackageRow[] = [];
  loading = true;
  packagesLoading = false;
  error = '';
  packageError = '';
  activeTab: 'users' | 'packages' = 'users';
  filterStatus = 'All';
  searchTerm = '';
  actionLoading: number | null = null;
  packageActionLoading: number | null = null;
  toast = { visible: false, message: '' };
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  userLookupEmail = '';
  userLookupLoading = false;
  userLookupError = '';
  userLookupResult: UserLookupResult | null = null;
  statusEditorBusiness: BusinessRow | null = null;
  editorSelectedPlan = 'lite';
  editorBillingPeriod: 'Monthly' | 'Yearly' = 'Monthly';
  editorPaymentStatus: 'Paid' | 'Unpaid' = 'Paid';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadBusinesses();
    this.loadPackages();
  }

  loadStats(): void {
    this.http.get<Stats>(`${environment.apiUrl}/superadmin/stats`)
      .pipe(timeout(15000))
      .subscribe({
        next: (data) => this.stats = data,
        error: (err) => {
          console.error('[SuperAdmin] loadStats error:', err);
          this.error = `Failed to load stats (${err?.status ?? err?.name ?? 'timeout'}).`;
        }
      });
  }

  loadBusinesses(): void {
    this.loading = true;
    this.http.get<BusinessRow[]>(`${environment.apiUrl}/superadmin/businesses`)
      .pipe(timeout(15000))
      .subscribe({
        next: (data) => {
          this.businesses = data.map(business => ({
            ...business,
            status: this.normalizeBusinessStatus(business.status)
          }));
          this.loading = false;
        },
        error: (err) => {
          console.error('[SuperAdmin] loadBusinesses error:', err);
          this.error = `Failed to load businesses (${err?.status ?? err?.name ?? 'timeout'}). Check console for details.`;
          this.loading = false;
        }
      });
  }

  get filteredBusinesses(): BusinessRow[] {
    return this.businesses.filter(b => {
      const matchesStatus = this.filterStatus === 'All' || this.statusLabel(b.status) === this.filterStatus;
      const term = this.searchTerm.toLowerCase();
      const matchesSearch = !term ||
        b.companyName.toLowerCase().includes(term) ||
        (b.ownerEmail || '').toLowerCase().includes(term) ||
        (b.ownerName || '').toLowerCase().includes(term) ||
        (b.businessEmail || '').toLowerCase().includes(term) ||
        (b.sector || '').toLowerCase().includes(term) ||
        (b.selectedPlan || '').toLowerCase().includes(term) ||
        (b.billingPeriod || '').toLowerCase().includes(term) ||
        this.paymentStatusLabel(b.paymentStatus).toLowerCase().includes(term) ||
        b.trn.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }

  get lookupBusinessStatus(): string {
    return this.userLookupResult?.appUser?.business?.status || '';
  }

  lookupUser(): void {
    const email = this.userLookupEmail.trim();
    this.userLookupError = '';
    this.userLookupResult = null;

    if (!email) {
      this.userLookupError = 'Enter an email address to check.';
      return;
    }

    this.userLookupLoading = true;
    this.http.get<UserLookupResult>(
      `${environment.apiUrl}/superadmin/users/lookup`,
      { params: { email } }
    )
      .pipe(timeout(15000))
      .subscribe({
        next: (result) => {
          this.userLookupResult = result;
          this.userLookupLoading = false;
        },
        error: (err) => {
          console.error('[SuperAdmin] lookupUser error:', err);
          this.userLookupError = err.error?.message
            ? err.error.message
            : `Failed to check user (${err?.status ?? err?.name ?? 'timeout'}).`;
          this.userLookupLoading = false;
        }
      });
  }

  openStatusEditor(biz: BusinessRow): void {
    this.statusEditorBusiness = biz;
    this.editorSelectedPlan = (biz.selectedPlan || 'lite').toLowerCase();
    this.editorBillingPeriod = this.normalizeBillingPeriod(biz.billingPeriod);
    this.editorPaymentStatus = this.paymentStatusLabel(biz.paymentStatus) === 'Paid' ? 'Paid' : 'Unpaid';
  }

  closeStatusEditor(): void {
    if (this.actionLoading !== this.statusEditorBusiness?.id) {
      this.statusEditorBusiness = null;
    }
  }

  activate(biz: BusinessRow): void {
    this.updateBusinessStatus(biz, 'Active');
  }

  suspend(biz: BusinessRow): void {
    this.updateBusinessStatus(biz, 'Suspended');
  }

  deactivate(biz: BusinessRow): void {
    this.updateBusinessStatus(biz, 'Deactivated');
  }

  private updateBusinessStatus(biz: BusinessRow, status: EditableBusinessStatus): void {
    const endpoint = this.statusActionPath(status);
    this.error = '';
    this.actionLoading = biz.id;
    this.http.post<{ message: string }>(
      `${environment.apiUrl}/superadmin/businesses/${biz.id}/${endpoint}`,
      {}
    ).subscribe({
      next: () => {
        biz.status = status;
        this.actionLoading = null;
        this.closeStatusEditor();
        this.loadStats();
      },
      error: () => {
        this.error = `Failed to update business status to ${status.toLowerCase()}.`;
        this.actionLoading = null;
      }
    });
  }

  saveBusinessSubscription(): void {
    if (!this.statusEditorBusiness) {
      return;
    }

    const business = this.statusEditorBusiness;
    this.error = '';
    this.actionLoading = business.id;
    this.http.put<any>(`${environment.apiUrl}/superadmin/businesses/${business.id}/subscription`, {
      selectedPlan: this.editorSelectedPlan,
      billingPeriod: this.editorBillingPeriod,
      paymentStatus: this.editorPaymentStatus === 'Paid' ? 1 : 0
    }).subscribe({
      next: (updated) => {
        business.status = this.normalizeBusinessStatus(updated.status);
        business.paymentStatus = updated.paymentStatus;
        business.subscriptionStatus = updated.subscriptionStatus;
        business.selectedPlan = updated.selectedPlan;
        business.billingPeriod = updated.billingPeriod;
        business.paymentCompletedAt = updated.paymentCompletedAt;
        business.nextPaymentDueAt = updated.nextPaymentDueAt;
        business.gracePeriodEndsAt = updated.gracePeriodEndsAt;
        business.lastPaymentMethod = updated.lastPaymentMethod;
        this.actionLoading = null;
        this.showToast('Subscription saved!');
        this.loadStats();
      },
      error: (err) => {
        console.error('[SuperAdmin] saveBusinessSubscription error:', err);
        this.error = err.error?.message || 'Failed to save subscription.';
        this.actionLoading = null;
      }
    });
  }

  loadPackages(): void {
    this.packagesLoading = true;
    this.packageError = '';
    this.http.get<PackageRow[]>(`${environment.apiUrl}/superadmin/packages`)
      .pipe(timeout(15000))
      .subscribe({
        next: (data) => {
          this.packages = data;
          this.packagesLoading = false;
        },
        error: (err) => {
          console.error('[SuperAdmin] loadPackages error:', err);
          const detail = err.error?.detail ? ` ${err.error.detail}` : '';
          this.packageError = err.error?.message
            ? `${err.error.message}${detail}`
            : `Failed to load packages (${err?.status ?? err?.name ?? 'timeout'}).`;
          this.packagesLoading = false;
        }
      });
  }

  showToast(message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { visible: true, message };
    this.toastTimer = setTimeout(() => { this.toast = { ...this.toast, visible: false }; }, 3000);
  }

  savePackageDiscount(pkg: PackageRow): void {
    this.savePackagePricing(pkg);
  }

  savePackagePricing(pkg: PackageRow): void {
    const monthlyPriceJmd = Number(pkg.monthlyPriceJmd) || 0;
    const yearlyPriceJmd = pkg.yearlyPriceJmd === null || pkg.yearlyPriceJmd === undefined || Number(pkg.yearlyPriceJmd) === 0
      ? null
      : Number(pkg.yearlyPriceJmd);
    const monthlySalePriceJmd = pkg.monthlySaleEnabled ? Number(pkg.monthlySalePriceJmd) || 0 : null;
    const yearlySalePriceJmd = pkg.yearlySaleEnabled ? Number(pkg.yearlySalePriceJmd) || 0 : null;

    if (monthlyPriceJmd <= 0) {
      this.packageError = 'Regular monthly price must be greater than 0.';
      return;
    }
    if (yearlyPriceJmd !== null && yearlyPriceJmd <= 0) {
      this.packageError = 'Regular yearly price must be greater than 0.';
      return;
    }
    if (pkg.monthlySaleEnabled && (!monthlySalePriceJmd || monthlySalePriceJmd <= 0)) {
      this.packageError = 'Monthly sale price must be greater than 0.';
      return;
    }
    if (pkg.yearlySaleEnabled && (!yearlySalePriceJmd || yearlySalePriceJmd <= 0)) {
      this.packageError = 'Yearly sale price must be greater than 0.';
      return;
    }
    const freeTrialDays = Number(pkg.freeTrialDays) || 0;
    if (freeTrialDays < 0) {
      this.packageError = 'Free trial days cannot be negative.';
      return;
    }

    this.packageActionLoading = pkg.id;
    this.packageError = '';
    this.http.put<PackageRow>(`${environment.apiUrl}/superadmin/packages/${pkg.id}/discount`, {
      monthlyPriceJmd,
      yearlyPriceJmd,
      monthlySaleEnabled: pkg.monthlySaleEnabled,
      monthlySalePriceJmd,
      yearlySaleEnabled: pkg.yearlySaleEnabled,
      yearlySalePriceJmd,
      freeTrialDays
    }).subscribe({
      next: (updated) => {
        this.packages = this.packages.map(item => item.id === updated.id ? updated : item);
        this.packageActionLoading = null;
        this.showToast('Package pricing saved!');
      },
      error: (err) => {
        console.error('[SuperAdmin] savePackagePricing error:', err);
        const detail = err.error?.detail ? ` ${err.error.detail}` : '';
        this.packageError = err.error?.message
          ? `${err.error.message}${detail}`
          : 'Failed to save package pricing.';
        this.packageActionLoading = null;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  statusLabel(status: string | number | null | undefined): string {
    return this.normalizeBusinessStatus(status);
  }

  statusPillClass(status: string | number | null | undefined): string {
    return `pill-${this.normalizeBusinessStatus(status).toLowerCase()}`;
  }

  paymentStatusLabel(status: string | number | null | undefined): string {
    if (typeof status === 'number') {
      return paymentStatusLabels[status] ?? 'Unknown';
    }

    return status || 'Unpaid';
  }

  paymentPillClass(status: string | number | null | undefined): string {
    const label = this.paymentStatusLabel(status).toLowerCase();
    return label === 'paid' ? 'pill-active' : 'pill-suspended';
  }

  private normalizeBusinessStatus(status: string | number | null | undefined): string {
    if (typeof status === 'string') {
      return status;
    }

    if (typeof status === 'number') {
      return businessStatusLabels[status] ?? 'Unknown';
    }

    return 'Unknown';
  }

  private statusActionPath(status: EditableBusinessStatus): 'activate' | 'suspend' | 'deactivate' {
    switch (status) {
      case 'Active':
        return 'activate';
      case 'Suspended':
        return 'suspend';
      case 'Deactivated':
        return 'deactivate';
    }
  }

  private normalizeBillingPeriod(period: string | null | undefined): 'Monthly' | 'Yearly' {
    return String(period || '').toLowerCase() === 'yearly' ? 'Yearly' : 'Monthly';
  }
}
