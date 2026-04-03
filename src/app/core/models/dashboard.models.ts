export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  gctLiability: number;
  payrollTaxLiability: number;
  totalTaxLiability: number;
  cashFlow: number;
}

export interface So1Report {
  businessId: number;
  month: number;
  year: number;
  payrollRemittance: number;
  gctPayable: number;
  totalRemittance: number;
}

export interface So2Report {
  businessId: number;
  year: number;
  totalPayrollRemittance: number;
  totalGctPayable: number;
  totalAnnualRemittance: number;
}
