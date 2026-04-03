import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>AccountEezy</h1>
        <p class="tagline">Simplify Your Business Accounting</p>
        <p class="description">
          Manage employees, payroll, transactions, and tax records all in one place.
        </p>
        <div class="cta-buttons">
          <button mat-raised-button color="primary" (click)="navigateToLogin()" class="login-btn">
            <mat-icon>login</mat-icon>
            Business Login
          </button>
          <button mat-raised-button (click)="navigateToEmployeeLogin()" class="employee-login-btn">
            <mat-icon>badge</mat-icon>
            Employee Portal
          </button>
        </div>
      </div>

      <div class="features-section">
        <h2>Features</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-icon>people</mat-icon>
            <h3>Employee Management</h3>
            <p>Manage employee records, profiles, and credentials</p>
          </mat-card>
          
          <mat-card class="feature-card">
            <mat-icon>payments</mat-icon>
            <h3>Payroll Processing</h3>
            <p>Process payroll with automated tax calculations</p>
          </mat-card>
          
          <mat-card class="feature-card">
            <mat-icon>receipt_long</mat-icon>
            <h3>Transaction Tracking</h3>
            <p>Track all business transactions and expenses</p>
          </mat-card>
          
          <mat-card class="feature-card">
            <mat-icon>assessment</mat-icon>
            <h3>Tax Reports</h3>
            <p>Generate SO1, SO2, and other tax reports</p>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .hero-section {
      text-align: center;
      color: white;
      padding: 4rem 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-section h1 {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .tagline {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: 1rem;
    }

    .description {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .login-btn {
      background: white !important;
      color: #667eea !important;
      font-weight: 600;
      padding: 0.5rem 2rem !important;
      font-size: 1.1rem !important;
    }

    .employee-login-btn {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      font-weight: 600;
      padding: 0.5rem 2rem !important;
      font-size: 1.1rem !important;
      border: 2px solid white !important;
    }

    .login-btn mat-icon,
    .employee-login-btn mat-icon {
      margin-right: 0.5rem;
    }

    .features-section {
      max-width: 1200px;
      margin: 4rem auto;
      padding: 2rem;
    }

    .features-section h2 {
      text-align: center;
      color: white;
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      transition: transform 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .feature-card mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToEmployeeLogin() {
    this.router.navigate(['/login']);
  }
}
