import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <div class="dashboard-layout">
      <!-- Top Navbar -->
      <mat-toolbar color="primary" class="app-bar">
        <!-- Hamburger: mobile only -->
        <button mat-icon-button class="menu-toggle" (click)="menuOpen = !menuOpen" aria-label="Toggle navigation">
          <mat-icon>{{ menuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>

        <span class="title">AccountEezy Dashboard</span>

        <span class="spacer"></span>

        @if (user$ | async; as user) {
          <span class="welcome-text">Welcome back, {{ $any(user).email ? $any(user).email.split('@')[0] : 'User' }}</span>
        }
        @if (user$ | async; as user) {
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
        }
      </mat-toolbar>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="navigate('/dashboard/profile')">
          <mat-icon>manage_accounts</mat-icon>
          <span>My Profile</span>
        </button>
        <button mat-menu-item (click)="navigate('/')">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </button>
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
            <a class="nav-link" routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="menuOpen = false">
              <mat-icon>dashboard</mat-icon>
              <span>Overview</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/employees" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>people</mat-icon>
              <span>Employees</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/payroll" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>payment</mat-icon>
              <span>Payroll</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/transactions" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>receipt</mat-icon>
              <span>Transactions</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/tax" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>account_balance</mat-icon>
              <span>Reports</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/leaves" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>event_available</mat-icon>
              <span>Leaves</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/notices" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>notifications</mat-icon>
              <span>Notices</span>
            </a>
            <a class="nav-link" routerLink="/dashboard/admin" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Admin</span>
            </a>
          </nav>
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
      background: var(--bg-light);
    }

    .app-bar {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 1001;
      background: var(--primary-brand) !important;
      position: sticky;
      top: 0;
    }

    /* Hamburger hidden on desktop */
    .menu-toggle {
      display: none;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .welcome-text {
      margin-right: 1rem;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.95);
    }

    .main-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    /* Sidebar Styles */
    .sidebar {
      width: 260px;
      background: var(--sidebar-bg);
      border-right: 1px solid rgba(255,255,255,0.14);
      box-shadow: 2px 0 8px rgba(7,71,166,0.18);
      overflow-y: auto;
      flex-shrink: 0;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: rgba(255, 255, 255, 0.92);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .nav-link:hover {
      background: var(--primary-brand);
      color: #ffffff;
    }

    .nav-link.active {
      background: var(--primary-brand);
      color: #ffffff;
      border-left-color: #ffffff;
      font-weight: 600;
    }

    .nav-link mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: inherit;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      background: var(--bg-light);
    }

    /* Mobile backdrop */
    .mobile-backdrop {
      display: none;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: inline-flex;
        margin-right: 0.25rem;
      }

      .title {
        font-size: 1.2rem;
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
      }
    }
  `]
})
export class DashboardLayoutComponent {
  menuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get user$() {
    return this.authService.user$;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
