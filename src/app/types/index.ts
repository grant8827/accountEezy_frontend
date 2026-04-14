// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role?: string;
}

// Business Types
export interface Business {
  id: number;
  name: string;
  registrationNumber: string;
  trn: string;
  nis?: string;
  businessType: string;
  industry: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
}

// Employee Types
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
  businessId: number;
  department?: string;
  status?: 'active' | 'on-leave' | 'inactive';
  // New fields for employee records
  nisNumber?: string;
  trn?: string;
  employeeIdNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  dateOfBirth?: string;
  address?: string;
  payCycle?: string;
  password?: string; // Only used when creating/updating
}

// Payroll Types
export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  payDate: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
  businessId: number;
}

// Dashboard Summary — matches DashboardSummaryResponse from DashboardController
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  gctLiability: number;
  payrollTaxLiability: number;
  totalTaxLiability: number;
  cashFlow: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Employee Auth Types
export interface EmployeeLoginRequest {
  email: string;
  password: string;
}

export interface EmployeeAuthResponse {
  token: string;
  expiresAt: string;
  employeeId: number;
  name: string;
  email: string;
  businessId: number;
}

// Leave Request Types
export interface LeaveRequest {
  id?: number;
  employeeId: number;
  leaveType: string; // "Vacation", "Sick", "Personal"
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason?: string;
  status: string; // "Pending", "Approved", "Rejected"
  adminNotes?: string;
  requestedOn?: string;
  reviewedOn?: string;
  reviewedBy?: number;
  documentPath?: string;
}

export interface LeaveRequestDto {
  leaveType: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason?: string;
  documentPath?: string;
}

export interface LeaveApprovalDto {
  status: string;
  adminNotes?: string;
}
