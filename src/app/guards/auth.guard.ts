import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }

        const user = this.authService.getCurrentUser();
        if (user && (user.requiresPayment || user.isSuspended) && !state.url.includes('/payment')) {
          this.router.navigate(['/payment'], {
            queryParams: {
              reason: user.isSuspended ? 'past-due' : 'payment-required',
              businessId: user.businessId || undefined,
              plan: user.selectedPlan || undefined,
              billing: user.billingPeriod?.toLowerCase() === 'yearly' ? 'yearly' : 'monthly'
            }
          });
          return false;
        }

        return true;
      })
    );
  }
}
