import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

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
            <a class="nav-link" routerLink="/employee-dashboard/notices" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>notifications</mat-icon>
              <span>Notices</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/profile" routerLinkActive="active" (click)="menuOpen = false">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
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
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
      border-right: 1px solid rgba(255,255,255,0.14);
      padding: 1.5rem 0;
      overflow-y: auto;
      flex-shrink: 0;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0 1rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.92);
      text-decoration: none;
      transition: all 0.2s;
      font-weight: 500;
    }

    .nav-link mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .nav-link:hover {
      background: var(--primary-brand);
      color: #ffffff;
    }

    .nav-link.active {
      background: var(--primary-brand);
      color: white;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
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
export class EmployeeDashboardLayoutComponent implements OnInit {
  employeeName: string = '';
  employeeEmail: string = '';
  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.employeeName = localStorage.getItem('employeeName') || 'Employee';
    this.employeeEmail = localStorage.getItem('employeeEmail') || '';
  }

  logout() {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeEmail');
    this.router.navigate(['/login']);
  }
}
