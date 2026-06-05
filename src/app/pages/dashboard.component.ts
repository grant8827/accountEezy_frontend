import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, User } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-content">
      <!-- Main Content -->
      <div class="container">
        @if (loading) {
          <div class="loading">
            <mat-spinner></mat-spinner>
          </div>
        } @else {
          <!-- Financial Summary Cards -->
          <div class="financial-summary">
            <!-- Income Card -->
            <div class="summary-card income-card">
              <div class="card-header">
                <div class="icon-wrapper income-icon">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="card-info">
                  <p class="card-label">Total Income</p>
                  <h2 class="card-value">{{ formatCurrency(dashboardData.income) }}</h2>
                  <div class="trend positive">
                    <mat-icon>arrow_upward</mat-icon>
                    <span>+{{ dashboardData.incomeGrowth }}% vs last month</span>
                  </div>
                </div>
              </div>
              <div class="mini-chart">
                <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    stroke-width="2"
                    [attr.points]="generateIncomeChartPoints()"
                  />
                </svg>
              </div>
            </div>

            <!-- Expenses Card -->
            <div class="summary-card expense-card">
              <div class="card-header">
                <div class="icon-wrapper expense-icon">
                  <mat-icon>trending_down</mat-icon>
                </div>
                <div class="card-info">
                  <p class="card-label">Total Expenses</p>
                  <h2 class="card-value">{{ formatCurrency(dashboardData.expenses) }}</h2>
                  <div class="trend negative">
                    <mat-icon>arrow_downward</mat-icon>
                    <span>+{{ dashboardData.expensesGrowth }}% vs last month</span>
                  </div>
                </div>
              </div>
              <div class="mini-chart">
                <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="2"
                    [attr.points]="generateExpenseChartPoints()"
                  />
                </svg>
              </div>
            </div>

            <!-- Balance Card -->
            <div class="summary-card balance-card">
              <div class="card-header">
                <div class="icon-wrapper balance-icon">
                  <mat-icon>account_balance_wallet</mat-icon>
                </div>
                <div class="card-info">
                  <p class="card-label">Net Balance</p>
                  <h2 class="card-value">{{ formatCurrency(dashboardData.balance) }}</h2>
                  <div class="trend positive">
                    <mat-icon>arrow_upward</mat-icon>
                    <span>+{{ dashboardData.balanceGrowth }}% vs last month</span>
                  </div>
                </div>
              </div>
              <div class="mini-chart">
                <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="2"
                    [attr.points]="generateBalanceChartPoints()"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-section">
            <!-- Monthly Growth Chart -->
            <mat-card class="chart-card">
              <mat-card-header>
                <mat-card-title>Monthly Revenue Growth</mat-card-title>
                <span class="period-selector">Last 6 Months</span>
              </mat-card-header>
              <mat-card-content>
                <div class="large-chart">
                  <svg viewBox="0 0 800 300" class="growth-chart">
                    <!-- Grid lines -->
                    <line x1="50" y1="250" x2="750" y2="250" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="50" y1="200" x2="750" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="50" y1="150" x2="750" y2="150" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="50" y1="100" x2="750" y2="100" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="50" y1="50" x2="750" y2="50" stroke="#e5e7eb" stroke-width="1"/>

                    <!-- Gradient fill -->
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:var(--color-primary);stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:var(--color-primary);stop-opacity:0" />
                      </linearGradient>
                    </defs>

                    <!-- Area fill -->
                    <path
                      [attr.d]="'M 50,' + (250 - monthlyData[0]) + ' L 166,' + (250 - monthlyData[1]) + ' L 283,' + (250 - monthlyData[2]) + ' L 400,' + (250 - monthlyData[3]) + ' L 517,' + (250 - monthlyData[4]) + ' L 633,' + (250 - monthlyData[5]) + ' L 750,' + (250 - monthlyData[6]) + ' L 750,250 L 50,250 Z'"
                      fill="url(#revenueGradient)"
                    />

                    <!-- Revenue line -->
                    <polyline
                      fill="none"
                      stroke="var(--color-primary)"
                      stroke-width="3"
                      [attr.points]="'50,' + (250 - monthlyData[0]) + ' 166,' + (250 - monthlyData[1]) + ' 283,' + (250 - monthlyData[2]) + ' 400,' + (250 - monthlyData[3]) + ' 517,' + (250 - monthlyData[4]) + ' 633,' + (250 - monthlyData[5]) + ' 750,' + (250 - monthlyData[6])"
                    />

                    <!-- Data points -->
                    @for (point of monthlyData; track $index) {
                      <circle [attr.cx]="50 + $index * 116.67" [attr.cy]="250 - point" r="5" fill="var(--color-primary)"/>
                    }

                    <!-- Month labels -->
                    <text x="50" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(0) }}</text>
                    <text x="166" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(1) }}</text>
                    <text x="283" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(2) }}</text>
                    <text x="400" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(3) }}</text>
                    <text x="517" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(4) }}</text>
                    <text x="633" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(5) }}</text>
                    <text x="750" y="280" text-anchor="middle" font-size="12" fill="#6b7280">{{ getMonthLabel(6) }}</text>
                  </svg>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Quick Stats -->
            <div class="quick-stats">
              <div class="stat-card">
                <mat-icon class="stat-icon">people</mat-icon>
                <div class="stat-info">
                  <p class="stat-label">Employees</p>
                  <h3 class="stat-value">{{ dashboardData.totalEmployees }}</h3>
                </div>
              </div>
              <div class="stat-card">
                <mat-icon class="stat-icon">receipt_long</mat-icon>
                <div class="stat-info">
                  <p class="stat-label">Transactions</p>
                  <h3 class="stat-value">{{ dashboardData.totalTransactions }}</h3>
                </div>
              </div>
              <div class="stat-card">
                <mat-icon class="stat-icon">schedule</mat-icon>
                <div class="stat-info">
                  <p class="stat-label">Pending</p>
                  <h3 class="stat-value">{{ dashboardData.pendingTransactions }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <button mat-raised-button routerLink="/dashboard/employees">
                <mat-icon>people</mat-icon> Manage Employees
              </button>
              <button mat-raised-button routerLink="/dashboard/payroll">
                <mat-icon>payment</mat-icon> Run Payroll
              </button>
              <button mat-raised-button routerLink="/dashboard/transactions">
                <mat-icon>receipt</mat-icon> View Transactions
              </button>
              <button mat-raised-button routerLink="/dashboard/tax">
                <mat-icon>account_balance</mat-icon> Tax Reports
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      width: 100%;
      min-height: 100vh;
      background: var(--bg-app);
      position: relative;
      overflow-x: hidden;
    }

    .container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    /* Financial Summary Cards */
    .financial-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: var(--bg-card);
      border-radius: var(--card-radius);
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(28,25,23,0.08);
      transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
      border: 1px solid var(--border-color);
      position: relative;
      overflow: hidden;
    }

    .summary-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(28,25,23,0.1);
    }

    .income-card {
      border-color: #BBF7D0;
    }

    .expense-card {
      border-color: #ef4444;
    }

    .balance-card {
      border-color: var(--color-primary);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .income-icon {
      background: linear-gradient(135deg, #16A34A, var(--color-primary));
    }

    .expense-icon {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .balance-icon {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    }

    .icon-wrapper mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .card-info {
      flex: 1;
    }

    .card-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 0.5rem 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0 0 0.5rem 0;
    }

    .trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .trend mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .trend.positive {
      color: var(--badge-success-text);
    }

    .trend.negative {
      color: #ef4444;
    }

    .mini-chart {
      height: 60px;
      margin-top: 1rem;
      opacity: 0.7;
    }

    .mini-chart svg {
      width: 100%;
      height: 100%;
    }

    /* Charts Section */
    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: var(--bg-card) !important;
      border: 1px solid var(--border-color);
      border-radius: var(--card-radius) !important;
      padding: 1.5rem !important;
      box-shadow: 0 1px 3px rgba(28,25,23,0.08);
    }

    .chart-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .chart-card mat-card-title {
      color: var(--text-main) !important;
      font-weight: 700 !important;
      font-size: 1.25rem !important;
      margin: 0 !important;
    }

    .period-selector {
      font-size: 0.875rem;
      color: var(--text-muted);
      background: var(--neutral-100);
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .large-chart {
      width: 100%;
      height: 300px;
    }

    .growth-chart {
      width: 100%;
      height: 100%;
    }

    /* Quick Stats */
    .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--card-radius);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }

    .stat-card:hover {
      border-color: var(--color-primary);
      transform: translateX(4px);
      box-shadow: 0 8px 18px rgba(28,25,23,0.08);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 0.25rem 0;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }

    /* Quick Actions */
    .quick-actions {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--card-radius);
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(28,25,23,0.08);
    }

    .quick-actions h3 {
      margin: 0 0 1rem 0;
      color: var(--text-main);
      font-weight: 700;
      font-size: 1.25rem;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-buttons button {
      background: var(--color-primary) !important;
      color: var(--color-primary-text) !important;
      border-radius: 10px;
      padding: 0.875rem 1.5rem !important;
      font-weight: 600;
      transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;
      border: none;
    }

    .action-buttons button:hover {
      transform: translateY(-2px);
      background: var(--color-primary-hover) !important;
      box-shadow: 0 8px 20px rgba(4,120,87,0.28);
    }

    .action-buttons button mat-icon {
      margin-right: 0.5rem;
    }

    @media (max-width: 1024px) {
      .charts-section {
        grid-template-columns: 1fr;
      }

      .quick-stats {
        flex-direction: row;
        overflow-x: auto;
      }

      .stat-card {
        min-width: 200px;
      }

      .center-nav {
        margin: 0 1rem;
        gap: 0.25rem;
      }

      .nav-link span {
        display: none;
      }

      .nav-link {
        padding: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .financial-summary {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }

      .welcome-text {
        display: none;
      }

      .title {
        font-size: 1.1rem;
      }

      .center-nav {
        margin: 0 0.5rem;
      }

      .app-bar {
        padding: 0 1rem !important;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  dashboardData = {
    income: 0,
    expenses: 0,
    balance: 0,
    incomeGrowth: 0,
    expensesGrowth: 0,
    balanceGrowth: 0,
    totalEmployees: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
  };

  // Monthly data for the growth chart (last 7 months including current)
  monthlyData: number[] = [];

  // Sparkline data for mini charts
  incomeSparkline: number[] = [];
  expenseSparkline: number[] = [];
  balanceSparkline: number[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load data immediately without artificial delay
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Main financial data
    this.dashboardData = {
      income: 2450000,
      expenses: 1680000,
      balance: 770000,
      incomeGrowth: 12.5,
      expensesGrowth: 8.3,
      balanceGrowth: 18.2,
      totalEmployees: 25,
      totalTransactions: 156,
      pendingTransactions: 8,
    };

    // Generate monthly growth data (normalized to 0-200 range for SVG)
    this.monthlyData = [120, 135, 128, 155, 170, 165, 190];

    // Generate sparkline data for mini charts
    this.incomeSparkline = [20, 25, 30, 28, 35, 40, 45, 42, 50];
    this.expenseSparkline = [15, 18, 22, 20, 25, 28, 30, 32, 35];
    this.balanceSparkline = [10, 12, 15, 18, 20, 25, 28, 30, 35];

    // Set loading to false immediately
    this.loading = false;
  }

  generateIncomeChartPoints(): string {
    // Generate SVG polyline points for income sparkline
    if (this.incomeSparkline.length === 0) return '';

    const width = 200;
    const height = 60;
    const max = Math.max(...this.incomeSparkline);
    const step = width / (this.incomeSparkline.length - 1);

    return this.incomeSparkline
      .map((value, index) => {
        const x = index * step;
        const y = height - (value / max) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }

  generateExpenseChartPoints(): string {
    if (this.expenseSparkline.length === 0) return '';

    const width = 200;
    const height = 60;
    const max = Math.max(...this.expenseSparkline);
    const step = width / (this.expenseSparkline.length - 1);

    return this.expenseSparkline
      .map((value, index) => {
        const x = index * step;
        const y = height - (value / max) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }

  generateBalanceChartPoints(): string {
    if (this.balanceSparkline.length === 0) return '';

    const width = 200;
    const height = 60;
    const max = Math.max(...this.balanceSparkline);
    const step = width / (this.balanceSparkline.length - 1);

    return this.balanceSparkline
      .map((value, index) => {
        const x = index * step;
        const y = height - (value / max) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }

  getMonthLabel(offsetFromCurrent: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - (6 - offsetFromCurrent), 1);
    return months[targetMonth.getMonth()];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
