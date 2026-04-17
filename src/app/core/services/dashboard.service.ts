import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardSummary, So1Report, So2Report } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/summary`);
  }

  getSo1(month: number, year: number) {
    return this.http.get<So1Report>(`${this.baseUrl}/reports/so1?month=${month}&year=${year}`);
  }

  getSo2(year: number) {
    return this.http.get<So2Report>(`${this.baseUrl}/reports/so2?year=${year}`);
  }
}
