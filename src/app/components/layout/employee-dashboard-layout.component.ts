import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employee-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="dashboard-layout">
      <!-- Top Navbar -->
      <mat-toolbar color="primary" class="app-bar">
        <!-- Hamburger: mobile only -->
        <button mat-icon-button class="menu-toggle" (click)="menuOpen = !menuOpen" aria-label="Toggle navigation">
          <mat-icon>{{ menuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>

        <span class="title">Employee Portal</span>

        <span class="spacer"></span>

        <span class="welcome-text">Welcome, {{ employeeName }}</span>
        <button
          mat-icon-button
          class="notification-button"
          type="button"
          (click)="openNotices()"
          [attr.aria-label]="unreadNoticeCount > 0 ? unreadNoticeCount + ' new notices' : 'No new notices'"
        >
          <mat-icon>{{ unreadNoticeCount > 0 ? 'notifications_active' : 'notifications_none' }}</mat-icon>
          @if (unreadNoticeCount > 0) {
            <span class="notification-badge">{{ unreadNoticeCount > 99 ? '99+' : unreadNoticeCount }}</span>
          }
        </button>
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
      </mat-toolbar>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item disabled>
          <mat-icon>email</mat-icon>
          <span>{{ employeeEmail }}</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>

      <!-- Main Content with Sidebar -->
      <div class="main-container">
        <!-- Mobile backdrop -->
        @if (menuOpen) {
          <div class="mobile-backdrop" (click)="menuOpen = false"></div>
        }

        <!-- Sidebar Navigation -->
        <aside class="sidebar" [class.mobile-open]="menuOpen">
          <nav class="sidebar-nav">
            <a class="nav-link" routerLink="/employee-dashboard/overview" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}" (click)="menuOpen = false">
              <mat-icon>dashboard</mat-icon>
              <span>Overview</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/payslips" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>receipt</mat-icon>
              <span>Payslips</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/leaves" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>event_available</mat-icon>
              <span>Leaves</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/notices" routerLinkActive="active" (click)="openNotices()">
              <mat-icon>notifications</mat-icon>
              <span>Notices</span>
              @if (unreadNoticeCount > 0) {
                <span class="sidebar-badge">{{ unreadNoticeCount > 99 ? '99+' : unreadNoticeCount }}</span>
              }
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/profile" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <div class="sidebar-profile">
              <mat-icon>account_circle</mat-icon>
              <div>
                <span class="profile-label">Employee</span>
                <strong>{{ employeeName }}</strong>
              </div>
            </div>
          </div>
        </aside>

        <!-- Content Area -->
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-app);
    }

    .app-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(28,25,23,0.12);
      background: var(--bg-card) !important;
      color: var(--text-main) !important;
      border-bottom: 1px solid var(--border-color);
    }

    /* Hamburger hidden on desktop */
    .menu-toggle {
      display: none;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .welcome-text {
      margin-right: 1rem;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .notification-button {
      position: relative;
      margin-right: 0.25rem;
      color: var(--text-muted);
    }

    .notification-button:has(.notification-badge) {
      color: var(--color-primary);
    }

    .notification-badge {
      position: absolute;
      top: 3px;
      right: 2px;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      display: grid;
      place-items: center;
      border: 2px solid var(--bg-card);
      border-radius: 999px;
      background: #dc2626;
      color: white;
      font-size: 0.62rem;
      font-weight: 800;
      line-height: 1;
      animation: notice-pulse 2s ease-in-out infinite;
    }

    .sidebar-badge {
      min-width: 22px;
      margin-left: auto;
      padding: 2px 6px;
      border-radius: 999px;
      background: #dc2626;
      color: white;
      font-size: 0.68rem;
      font-weight: 800;
      text-align: center;
    }

    @keyframes notice-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
      50% { box-shadow: 0 0 0 5px rgba(220, 38, 38, 0.16); }
    }

    .main-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .sidebar {
      width: 260px;
      background: var(--sidebar-bg);
      border-right: 1px solid rgba(255,255,255,0.08);
      padding: 1.5rem 0;
      overflow-y: auto;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0 1rem;
      flex: 1;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: var(--sidebar-text);
      text-decoration: none;
      transition: background 150ms ease, color 150ms ease;
      font-weight: 500;
    }

    .nav-link mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .nav-link:hover {
      background: var(--sidebar-active-bg);
      color: var(--sidebar-active-text);
    }

    .nav-link.active {
      background: var(--sidebar-active-bg);
      color: var(--sidebar-active-text);
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: var(--bg-app);
    }

    .sidebar-footer {
      border-top: 1px solid rgba(168, 162, 158, 0.24);
      padding: 1rem;
      margin-top: 1rem;
    }

    .sidebar-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--sidebar-active-text);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(168, 162, 158, 0.16);
      border-radius: 12px;
      padding: 0.75rem;
    }

    .sidebar-profile mat-icon {
      color: var(--sidebar-text);
    }

    .profile-label {
      display: block;
      color: var(--sidebar-text);
      font-size: 0.72rem;
      margin-bottom: 0.15rem;
    }

    .sidebar-profile strong {
      display: block;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.9rem;
    }

    /* Mobile backdrop */
    .mobile-backdrop {
      display: none;
    }

    @media (max-width: 640px) {
      .menu-toggle {
        display: inline-flex;
        margin-right: 0.25rem;
      }

      .welcome-text {
        display: none;
      }

      /* Sidebar hidden off-screen by default on mobile */
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 260px;
        z-index: 1002;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        padding-top: 1.5rem;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      /* Semi-transparent backdrop */
      .mobile-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 1001;
      }

      /* Content takes full width */
      .content {
        width: 100%;
        padding: 1rem;
      }
    }
  `]
})
export class EmployeeDashboardLayoutComponent implements OnInit, OnDestroy {
  employeeName: string = '';
  employeeEmail: string = '';
  menuOpen = false;
  unreadNoticeCount = 0;
  private latestNoticeAt = '';
  private refreshTimer?: ReturnType<typeof setInterval>;
  private routerSubscription?: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.employeeName = localStorage.getItem('employeeName') || 'Employee';
    this.employeeEmail = localStorage.getItem('employeeEmail') || '';
    this.loadNoticeAlert();
    this.refreshTimer = setInterval(() => this.loadNoticeAlert(), 60_000);
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      if ((event as NavigationEnd).urlAfterRedirects.includes('/employee-dashboard/notices')) {
        this.markNoticesSeen();
      }
    });
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.routerSubscription?.unsubscribe();
  }

  openNotices() {
    this.menuOpen = false;
    this.markNoticesSeen();
    this.router.navigate(['/employee-dashboard/notices']);
  }

  private loadNoticeAlert() {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<Array<{ createdAt: string }>>(`${environment.apiUrl}/employee-portal/notices`, { headers }).subscribe({
      next: notices => {
        this.latestNoticeAt = notices.reduce(
          (latest, notice) => notice.createdAt > latest ? notice.createdAt : latest,
          ''
        );
        const lastSeen = localStorage.getItem(this.noticeSeenKey) || '';
        this.unreadNoticeCount = notices.filter(notice => notice.createdAt > lastSeen).length;

        if (this.router.url.includes('/employee-dashboard/notices')) {
          this.markNoticesSeen();
        }
      }
    });
  }

  private markNoticesSeen() {
    if (this.latestNoticeAt) {
      localStorage.setItem(this.noticeSeenKey, this.latestNoticeAt);
    }
    this.unreadNoticeCount = 0;
  }

  private get noticeSeenKey(): string {
    return `employeeNoticeSeen:${localStorage.getItem('employeeId') || this.employeeEmail || 'unknown'}`;
  }

  logout() {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeEmail');
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.router.navigate(['/']);
  }
}
