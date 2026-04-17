import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PayrollRequest, PayrollResponse } from '../models/payroll.models';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly apiUrl = '/api/payroll/calculate';

  constructor(private http: HttpClient) {}

  calculate(payload: PayrollRequest) {
    return this.http.post<PayrollResponse>(this.apiUrl, payload);
  }
}
