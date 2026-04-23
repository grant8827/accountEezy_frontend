import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../types/index';
import { environment } from '../../environments/environment';

// Backend employee model - matches C# JSON serialization (camelCase)
interface BackendEmployee {
  id: number;
  name: string;
  nisNumber: string;  // NISNumber in C# becomes nisNumber in JSON
  grossSalary: number;
  payCycle: string;
  businessId: number;
  trn?: string;
  employeeIdNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  dateOfBirth?: string;
  address?: string;
  email?: string;
  isActive: boolean;
  employmentType?: string;
  vacationDaysBalance?: number;
  position?: string;
  department?: string;
  hireDate?: string;
  ytdGross?: number;
  ytdNis?: number;
  ytdNht?: number;
  ytdEducationTax?: number;
  ytdPaye?: number;
  ytdTotalDeductions?: number;
}

interface EmployeeRequest {
  name: string;
  nisNumber: string;
  grossSalary: number;
  payCycle: string;
  trn?: string;
  employeeIdNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  dateOfBirth?: string;
  address?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  employmentType?: string;
  vacationDaysBalance?: number;
  position?: string;
  department?: string;
  hireDate?: string;
  ytdGross?: number;
  ytdNis?: number;
  ytdNht?: number;
  ytdEducationTax?: number;
  ytdPaye?: number;
  ytdTotalDeductions?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = environment.apiUrl + '/employees';

  constructor(private http: HttpClient) {}

  // Map backend employee to frontend employee
  private mapToFrontend(backendEmp: BackendEmployee): Employee {
    const nameParts = backendEmp.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: backendEmp.id,
      firstName: firstName,
      lastName: lastName,
      email: backendEmp.email || `${backendEmp.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      position: backendEmp.position || 'Employee',
      salary: backendEmp.grossSalary,
      hireDate: backendEmp.hireDate ? backendEmp.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
      businessId: backendEmp.businessId,
      department: backendEmp.department || 'General',
      status: backendEmp.isActive ? 'active' : 'inactive',
      nisNumber: backendEmp.nisNumber,
      trn: backendEmp.trn,
      employeeIdNumber: backendEmp.employeeIdNumber,
      bankAccountNumber: backendEmp.bankAccountNumber,
      bankName: backendEmp.bankName,
      dateOfBirth: backendEmp.dateOfBirth,
      address: backendEmp.address,
      payCycle: this.mapPayCycleToFrontend(backendEmp.payCycle),
      employmentType: (backendEmp.employmentType as 'Salary' | 'Hourly') || 'Salary',
      vacationDaysBalance: backendEmp.vacationDaysBalance ?? 0,
      ytdGross: backendEmp.ytdGross ?? 0,
      ytdNis: backendEmp.ytdNis ?? 0,
      ytdNht: backendEmp.ytdNht ?? 0,
      ytdEducationTax: backendEmp.ytdEducationTax ?? 0,
      ytdPaye: backendEmp.ytdPaye ?? 0,
      ytdTotalDeductions: backendEmp.ytdTotalDeductions ?? 0
    };
  }

  // Map frontend employee to backend request
  private mapToBackend(employee: Employee): EmployeeRequest {
    return {
      name: `${employee.firstName} ${employee.lastName}`.trim(),
      nisNumber: employee.nisNumber || 'N/A',
      grossSalary: employee.salary,
      payCycle: this.mapPayCycleToBackend(employee.payCycle),
      trn: employee.trn,
      employeeIdNumber: employee.employeeIdNumber,
      bankAccountNumber: employee.bankAccountNumber,
      bankName: employee.bankName,
      dateOfBirth: employee.dateOfBirth,
      address: employee.address,
      email: employee.email,
      password: employee.password,
      isActive: employee.status !== 'inactive',
      employmentType: employee.employmentType || 'Salary',
      vacationDaysBalance: employee.vacationDaysBalance ?? 0,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate,
      ytdGross: employee.ytdGross ?? 0,
      ytdNis: employee.ytdNis ?? 0,
      ytdNht: employee.ytdNht ?? 0,
      ytdEducationTax: employee.ytdEducationTax ?? 0,
      ytdPaye: employee.ytdPaye ?? 0,
      ytdTotalDeductions: employee.ytdTotalDeductions ?? 0
    };
  }

  private mapPayCycleToFrontend(payCycle?: string): string {
    if (!payCycle) {
      return 'Monthly';
    }

    return payCycle === 'Bi-Weekly' ? 'Fortnightly' : payCycle;
  }

  private mapPayCycleToBackend(payCycle?: string): string {
    if (!payCycle) {
      return 'Monthly';
    }

    return payCycle === 'Bi-Weekly' ? 'Fortnightly' : payCycle;
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<BackendEmployee[]>(this.apiUrl).pipe(
      map(backendEmps => backendEmps.map(emp => this.mapToFrontend(emp)))
    );
  }

  create(employee: Employee): Observable<Employee> {
    const request = this.mapToBackend(employee);
    return this.http.post<BackendEmployee>(this.apiUrl, request).pipe(
      map(backendEmp => this.mapToFrontend(backendEmp))
    );
  }

  update(id: number, employee: Employee): Observable<Employee> {
    const request = this.mapToBackend(employee);
    return this.http.put<BackendEmployee>(`${this.apiUrl}/${id}`, request).pipe(
      map(backendEmp => this.mapToFrontend(backendEmp))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
