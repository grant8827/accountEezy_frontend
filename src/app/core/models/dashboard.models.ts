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
  financial?: FinancialSummary;
}

export interface So2Report {
  businessId: number;
  year: number;
  totalPayrollRemittance: number;
  totalGctPayable: number;
  totalAnnualRemittance: number;
}
