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
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <a class="nav-link" routerLink="/employee-dashboard/overview" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
              <mat-icon>dashboard</mat-icon>
              <span>Overview</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/payslips" routerLinkActive="active">
              <mat-icon>receipt</mat-icon>
              <span>Payslips</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/leaves" routerLinkActive="active">
              <mat-icon>event_available</mat-icon>
              <span>Leaves</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/notices" routerLinkActive="active">
              <mat-icon>notifications</mat-icon>
              <span>Notices</span>
            </a>
            <a class="nav-link" routerLink="/employee-dashboard/profile" routerLinkActive="active">
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
      background: #f8fafc;
    }

    .app-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    }

    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid #e5e7eb;
      padding: 1.5rem 0;
      overflow-y: auto;
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
      color: #6b7280;
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
      background: #f3f4f6;
      color: #667eea;
    }

    .nav-link.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 200px;
      }

      .nav-link span {
        font-size: 0.9rem;
      }

      .content {
        padding: 1rem;
      }
    }

    @media (max-width: 640px) {
      .main-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
      }

      .sidebar-nav {
        flex-direction: row;
        overflow-x: auto;
        padding: 0 0.5rem;
      }

      .nav-link {
        flex-direction: column;
        gap: 0.25rem;
        min-width: 80px;
        text-align: center;
      }

      .nav-link span {
        font-size: 0.75rem;
      }
    }
  `]
})
export class EmployeeDashboardLayoutComponent implements OnInit {
  employeeName: string = '';
  employeeEmail: string = '';

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
