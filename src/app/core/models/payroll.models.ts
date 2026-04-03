export interface PayrollRequest {
  grossMonthlySalary: number;
}

export interface PayrollResponse {
  grossMonthlySalary: number;
  netMonthlySalary: number;
  employeeNis: number;
  employeeNht: number;
  employeeEducationTax: number;
  employeePaye: number;
  employerNis: number;
  employerNht: number;
  employerEducationTax: number;
  employerHeart: number;
  consolidatedPayrollTaxEmployee: number;
  consolidatedPayrollTaxEmployer: number;
  totalStatutoryRemittance: number;
}
