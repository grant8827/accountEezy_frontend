import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PackagePrice {
  id: number;
  key: string;
  name: string;
  monthlyPriceJmd: number;
  yearlyPriceJmd?: number | null;
  isCustom: boolean;
  monthlySaleEnabled: boolean;
  monthlySalePriceJmd?: number | null;
  yearlySaleEnabled: boolean;
  yearlySalePriceJmd?: number | null;
  freeTrialDays: number;
  discountedMonthlyPriceJmd: number;
  regularYearlyPriceJmd: number;
  discountedYearlyPriceJmd: number;
}

@Injectable({
  providedIn: 'root'
})
export class PackagePricingService {
  constructor(private http: HttpClient) {}

  getPackages(): Observable<PackagePrice[]> {
    return this.http.get<PackagePrice[]>(`${environment.apiUrl}/superadmin/packages`);
  }

  getPackageMap(): Observable<Record<string, PackagePrice>> {
    return this.getPackages().pipe(
      map(packages => packages.reduce<Record<string, PackagePrice>>((acc, pkg) => {
        acc[pkg.key] = pkg;
        return acc;
      }, {}))
    );
  }

  priceFor(pkg: PackagePrice | undefined, billing: 'monthly' | 'yearly', fallbackMonthly: number): number {
    if (!pkg) {
      return billing === 'yearly' ? fallbackMonthly * 12 * 0.8 : fallbackMonthly;
    }

    return billing === 'yearly'
      ? pkg.discountedYearlyPriceJmd
      : pkg.discountedMonthlyPriceJmd;
  }
}
