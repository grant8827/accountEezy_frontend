import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaxConfig } from '../models/dashboard.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaxConfigService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<TaxConfig>(`${this.baseUrl}/tax-config`);
  }
}
