import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FinancialLineItem {
  category: string;
  totalAmount: number;
}

export interface FinancialSummary {
  incomeItems: FinancialLineItem[];
  expenseItems: FinancialLineItem[];
  totalIncome: number;
  totalExpenses: number;
  totalSalaryPaid: number;
  netPosition: number;
}

export interface MonthlyTaxReport {
  businessId: number;
  month: number;
  year: number;
  monthName: string;
  nisEmployee: number;
  nisEmployer: number;
  nhtEmployee: number;
  nhtEmployer: number;
  educationTaxEmployee: number;
  educationTaxEmployer: number;
  payeEmployee: number;
  heartEmployer: number;
  gctPayable: number;
  totalPayrollRemittance: number;
  totalGct: number;
  totalRemittance: number;
  status: string;
  taxRecordId: number | null;
  financial: FinancialSummary;
}

export interface QuarterlyTaxReport {
  businessId: number;
  quarter: number;
  year: number;
  quarterLabel: string;
  months: MonthlyTaxReport[];
  totalNisEmployee: number;
  totalNisEmployer: number;
  totalNhtEmployee: number;
  totalNhtEmployer: number;
  totalEducationTaxEmployee: number;
  totalEducationTaxEmployer: number;
  totalPayeEmployee: number;
  totalHeartEmployer: number;
  totalGctPayable: number;
  totalPayrollRemittance: number;
  totalRemittance: number;
  financial: FinancialSummary;
}

export interface YearlyTaxReport {
  businessId: number;
  year: number;
  months: MonthlyTaxReport[];
  totalNisEmployee: number;
  totalNisEmployer: number;
  totalNhtEmployee: number;
  totalNhtEmployer: number;
  totalEducationTaxEmployee: number;
  totalEducationTaxEmployer: number;
  totalPayeEmployee: number;
  totalHeartEmployer: number;
  totalGctPayable: number;
  totalPayrollRemittance: number;
  totalRemittance: number;
  financial: FinancialSummary;
}

export interface TaxRecord {
  id: number;
  businessId: number;
  month: number;
  year: number;
  totalRemittance: number;
  status: number; // 1 = Pending, 2 = Paid
}

export interface So1Report {
  businessId: number;
  businessName: string;
  trn: string;
  month: number;
  monthName: string;
  year: number;
  employeeCount: number;
  nisEmployee: number;
  nisEmployer: number;
  nhtEmployee: number;
  nhtEmployer: number;
  educationTaxEmployee: number;
  educationTaxEmployer: number;
  payeEmployee: number;
  heartEmployer: number;
  payrollRemittance: number;
  gctPayable: number;
  totalRemittance: number;
  status: string;
  taxRecordId: number | null;
}

export interface So2MonthRow {
  month: number;
  monthName: string;
  payrollRemittance: number;
  gctPayable: number;
  totalRemittance: number;
  status: string;
}

export interface So2Report {
  businessId: number;
  businessName: string;
  trn: string;
  year: number;
  employeeCount: number;
  totalNisEmployee: number;
  totalNisEmployer: number;
  totalNhtEmployee: number;
  totalNhtEmployer: number;
  totalEducationTaxEmployee: number;
  totalEducationTaxEmployer: number;
  totalPayeEmployee: number;
  totalHeartEmployer: number;
  totalPayrollRemittance: number;
  totalGctPayable: number;
  totalAnnualRemittance: number;
  monthlyBreakdown: So2MonthRow[];
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private http = inject(HttpClient);
  private base = '/api/reports';

  getMonthly(month: number, year: number): Observable<MonthlyTaxReport> {
    return this.http.get<MonthlyTaxReport>(`${this.base}/monthly?month=${month}&year=${year}`);
  }

  getQuarterly(quarter: number, year: number): Observable<QuarterlyTaxReport> {
    return this.http.get<QuarterlyTaxReport>(`${this.base}/quarterly?quarter=${quarter}&year=${year}`);
  }

  getYearly(year: number): Observable<YearlyTaxReport> {
    return this.http.get<YearlyTaxReport>(`${this.base}/yearly?year=${year}`);
  }

  getSo1(month: number, year: number): Observable<So1Report> {
    return this.http.get<So1Report>(`${this.base}/so1?month=${month}&year=${year}`);
  }

  getSo2(year: number): Observable<So2Report> {
    return this.http.get<So2Report>(`${this.base}/so2?year=${year}`);
  }

  getTaxHistory(): Observable<TaxRecord[]> {
    return this.http.get<TaxRecord[]>(`${this.base}/tax-history`);
  }

  markAsPaid(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/tax-records/${id}/pay`, {});
  }
}
