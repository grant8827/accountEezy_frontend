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
  status: string;
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
}

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
                <stop stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/>
              </linearGradient>
            </defs>
          </svg>
          <span>AccountEezy <span class="sa-badge">Super Admin</span></span>
        </div>
        <button class="btn-logout" (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </div>

      <div class="sa-body">
        <h1>Platform Dashboard</h1>

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
        </div>

        <!-- Filter + search -->
        <div class="table-toolbar">
          <input class="search-input" [(ngModel)]="searchTerm" placeholder="Search by name, email or TRN..." />
          <div class="filter-tabs">
            <button [class.active]="filterStatus === 'All'" (click)="filterStatus = 'All'">All</button>
            <button [class.active]="filterStatus === 'Pending'" (click)="filterStatus = 'Pending'">Pending</button>
            <button [class.active]="filterStatus === 'Active'" (click)="filterStatus = 'Active'">Active</button>
            <button [class.active]="filterStatus === 'Suspended'" (click)="filterStatus = 'Suspended'">Suspended</button>
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
                  <span class="status-pill" [class]="'pill-' + biz.status.toLowerCase()">
                    {{ biz.status }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn-approve" *ngIf="biz.status !== 'Active'"
                      (click)="approve(biz)" [disabled]="actionLoading === biz.id">
                      Approve
                    </button>
                    <button class="btn-suspend" *ngIf="biz.status !== 'Suspended'"
                      (click)="suspend(biz)" [disabled]="actionLoading === biz.id">
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredBusinesses.length === 0">
                <td colspan="8" class="empty-row">No businesses found.</td>
              </tr>
            </tbody>
          </table>
        </div>
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
      background: linear-gradient(135deg, #4F46E5, #06B6D4);
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

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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
    .stat-value { font-size: 2rem; font-weight: 700; color: #F1F5F9; }
    .stat-card.active .stat-value  { color: #4ADE80; }
    .stat-card.pending .stat-value { color: #FBBF24; }
    .stat-card.suspended .stat-value { color: #F87171; }
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
      background: rgba(79,70,229,0.2);
      border-color: rgba(79,70,229,0.5);
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

    /* Action buttons */
    .action-btns { display: flex; gap: 8px; }
    .btn-approve, .btn-suspend {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }
    .btn-approve:disabled, .btn-suspend:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-approve { background: rgba(74,222,128,0.15); color: #4ADE80; border: 1px solid rgba(74,222,128,0.3); }
    .btn-approve:hover:not(:disabled) { background: rgba(74,222,128,0.25); }
    .btn-suspend { background: rgba(248,113,113,0.12); color: #F87171; border: 1px solid rgba(248,113,113,0.3); }
    .btn-suspend:hover:not(:disabled) { background: rgba(248,113,113,0.22); }

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

    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .sa-body { padding: 20px 16px; }
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .table-toolbar { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  stats: Stats | null = null;
  businesses: BusinessRow[] = [];
  loading = true;
  error = '';
  filterStatus = 'All';
  searchTerm = '';
  actionLoading: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadBusinesses();
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
          this.businesses = data;
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
      const matchesStatus = this.filterStatus === 'All' || b.status === this.filterStatus;
      const term = this.searchTerm.toLowerCase();
      const matchesSearch = !term ||
        b.companyName.toLowerCase().includes(term) ||
        (b.ownerEmail || '').toLowerCase().includes(term) ||
        b.trn.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }

  approve(biz: BusinessRow): void {
    this.actionLoading = biz.id;
    this.http.post<{ message: string }>(
      `${environment.apiUrl}/superadmin/businesses/${biz.id}/approve`,
      {}
    ).subscribe({
      next: () => {
        biz.status = 'Active';
        this.actionLoading = null;
        this.loadStats();
      },
      error: () => {
        this.error = 'Failed to approve business.';
        this.actionLoading = null;
      }
    });
  }

  suspend(biz: BusinessRow): void {
    this.actionLoading = biz.id;
    this.http.post<{ message: string }>(
      `${environment.apiUrl}/superadmin/businesses/${biz.id}/suspend`,
      {}
    ).subscribe({
      next: () => {
        biz.status = 'Suspended';
        this.actionLoading = null;
        this.loadStats();
      },
      error: () => {
        this.error = 'Failed to suspend business.';
        this.actionLoading = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
