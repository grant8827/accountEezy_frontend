import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { TrialGuard } from './guards/trial.guard';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { LandingComponent } from './features/landing/landing.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout.component';
import { EmployeeDashboardLayoutComponent } from './components/layout/employee-dashboard-layout.component';
import { AdminPanelComponent } from './pages/admin-panel.component';
import { PricingPageComponent } from './pages/pricing-page.component';
import { PaymentPageComponent } from './pages/payment-page.component';
import { DebugEnvPageComponent } from './pages/debug-env-page.component';
import { BusinessListComponent } from './components/business/business-list.component';
import { EmployeeListComponent } from './components/employees/employee-list.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { PayrollModuleComponent } from './components/payroll/payroll-module.component';
import { TaxModuleComponent } from './components/tax/tax-module.component';
import { ApiTestComponent } from './components/debug/api-test.component';
import { NoticesComponent } from './components/notices/notices.component';
import { EmployeeRecordsComponent } from './components/employees/employee-records.component';
import { LeaveRequestsComponent } from './components/leaves/leave-requests.component';
import { EmployeeLoginComponent } from './components/auth/employee-login.component';
import { EmployeeDashboardComponent } from './components/employee-portal/employee-dashboard.component';

export const routes: Routes = [
  // Home Page
  { path: '', component: LandingComponent },

  // Public Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employee-login', redirectTo: 'login', pathMatch: 'full' },
  { path: 'pricing', component: PricingPageComponent },
  { path: 'payment', component: PaymentPageComponent },
  { path: 'debug-env', component: DebugEnvPageComponent },
  { path: 'api-test', component: ApiTestComponent },

  // Employee Dashboard with Sidebar Layout
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: EmployeeDashboardComponent
      },
      {
        path: 'payslips',
        component: EmployeeDashboardComponent
      },
      {
        path: 'leaves',
        component: EmployeeDashboardComponent
      },
      {
        path: 'notices',
        component: EmployeeDashboardComponent
      },
      {
        path: 'profile',
        component: EmployeeDashboardComponent
      }
    ]
  },

  // Protected Routes with Dashboard Layout
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard, TrialGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'employees',
        component: EmployeeListComponent
      },
      {
        path: 'employee-records',
        component: EmployeeRecordsComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'payroll',
        component: PayrollModuleComponent
      },
      {
        path: 'tax',
        component: TaxModuleComponent
      },
      {
        path: 'notices',
        component: NoticesComponent
      },
      {
        path: 'leaves',
        component: LeaveRequestsComponent
      },
      {
        path: 'businesses',
        component: BusinessListComponent
      },
      {
        path: 'admin',
        component: AdminPanelComponent
      }
    ]
  },

  // Legacy routes - redirect to dashboard children
  { path: 'employees', redirectTo: 'dashboard/employees', pathMatch: 'full' },
  { path: 'transactions', redirectTo: 'dashboard/transactions', pathMatch: 'full' },
  { path: 'payroll', redirectTo: 'dashboard/payroll', pathMatch: 'full' },
  { path: 'tax', redirectTo: 'dashboard/tax', pathMatch: 'full' },
  { path: 'notices', redirectTo: 'dashboard/notices', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'dashboard/admin', pathMatch: 'full' },

  // 404 catch all
  { path: '**', redirectTo: '' }
];
