import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EmployeeLimitDialogData {
  currentPlan: string | null;
  employeeLimit: number;
  currentCount: number;
}

function nextPlanName(plan: string | null): string {
  switch (plan?.toLowerCase()) {
    case 'lite':    return 'Starter';
    case 'starter': return 'Growth';
    case 'growth':  return 'Custom';
    default:        return 'a higher plan';
  }
}

@Component({
  selector: 'app-employee-limit-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="limit-dialog">
      <div class="dialog-icon">
        <mat-icon>lock_upgrade</mat-icon>
      </div>

      <h2 mat-dialog-title>Employee Limit Reached</h2>

      <mat-dialog-content>
        <p class="limit-info">
          You currently have <strong>{{ data.currentCount }}</strong> employee{{ data.currentCount !== 1 ? 's' : '' }}
          and have reached the maximum of <strong>{{ data.employeeLimit }}</strong> allowed on your
          <strong class="plan-name">{{ (data.currentPlan ?? 'current') | uppercase }}</strong> plan.
        </p>
        <p class="upgrade-msg">
          Upgrade to <strong>{{ nextPlan }}</strong> to add more employees and unlock additional features.
        </p>

        <div class="plan-row">
          <div class="plan-box current">
            <span class="plan-label">Current Plan</span>
            <span class="plan-tier">{{ (data.currentPlan ?? 'Trial') | titlecase }}</span>
            <span class="plan-limit">Up to {{ data.employeeLimit }} employees</span>
          </div>
          <mat-icon class="arrow-icon">arrow_forward</mat-icon>
          <div class="plan-box upgrade">
            <span class="plan-label">Upgrade To</span>
            <span class="plan-tier">{{ nextPlan }}</span>
            <span class="plan-limit">More employees</span>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close class="cancel-btn">Not Now</button>
        <button mat-raised-button class="upgrade-btn" (click)="upgrade()">
          <mat-icon>rocket_launch</mat-icon>
          Upgrade Plan
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .limit-dialog {
      padding: 0.5rem;
      text-align: center;
    }

    .dialog-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      margin: 0 auto 1rem;
    }

    .dialog-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
    }

    h2[mat-dialog-title] {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      text-align: center;
    }

    mat-dialog-content {
      padding: 1rem 0 !important;
    }

    .limit-info {
      color: #4b5563;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0 0 0.75rem 0;
    }

    .upgrade-msg {
      color: #6b7280;
      font-size: 0.9rem;
      margin: 0 0 1.5rem 0;
    }

    .plan-name {
      color: var(--color-primary);
    }

    .plan-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      margin: 0 0 0.5rem 0;
    }

    .plan-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      flex: 1;
      max-width: 160px;
    }

    .plan-box.current {
      background: #f3f4f6;
      border: 2px solid #e5e7eb;
    }

    .plan-box.upgrade {
      background: linear-gradient(135deg, rgba(4,120,87,0.08), rgba(4,120,87,0.12));
      border: 2px solid var(--color-primary);
    }

    .plan-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
    }

    .plan-tier {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1f2937;
    }

    .plan-box.upgrade .plan-tier {
      color: var(--color-primary);
    }

    .plan-limit {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .arrow-icon {
      color: #9ca3af;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .cancel-btn {
      color: #6b7280;
    }

    .upgrade-btn {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover)) !important;
      color: white !important;
      border-radius: 8px;
      font-weight: 600;
    }

    .upgrade-btn mat-icon {
      margin-right: 0.25rem;
    }
  `]
})
export class EmployeeLimitDialogComponent {
  nextPlan: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmployeeLimitDialogData,
    private dialogRef: MatDialogRef<EmployeeLimitDialogComponent>,
    private router: Router
  ) {
    this.nextPlan = nextPlanName(data.currentPlan);
  }

  upgrade() {
    this.dialogRef.close();
    this.router.navigate(['/payment']);
  }
}
