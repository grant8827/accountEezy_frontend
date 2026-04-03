import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { LeaveRequest, LeaveRequestDto } from '../../types/index';

@Component({
  selector: 'app-apply-leave-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>event_available</mat-icon>
      Apply for Leave
    </h2>
    <mat-dialog-content>
      <form [formGroup]="leaveForm" class="leave-form">
        <mat-form-field appearance="outline">
          <mat-label>Leave Type</mat-label>
          <mat-select formControlName="leaveType">
            <mat-option value="Vacation">Vacation</mat-option>
            <mat-option value="Sick">Sick Leave</mat-option>
            <mat-option value="Personal">Personal</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="date-range">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Number of Days</mat-label>
          <input matInput type="number" formControlName="daysRequested" min="1">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Reason (Optional)</mat-label>
          <textarea matInput rows="3" formControlName="reason" placeholder="Brief explanation for your leave request"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="leaveForm.invalid" (click)="submit()">
        <mat-icon>send</mat-icon>
        Submit Request
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .leave-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
    }

    .date-range {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 640px) {
      .leave-form {
        min-width: 300px;
      }

      .date-range {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ApplyLeaveDialogComponent {
  leaveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplyLeaveDialogComponent>
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['Vacation', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysRequested: [1, [Validators.required, Validators.min(1)]],
      reason: ['']
    });
  }

  submit() {
    if (this.leaveForm.valid) {
      this.dialogRef.close(this.leaveForm.value);
    }
  }
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <!-- Payslip Detail Overlay -->
    <div *ngIf="showPayslipDetail && selectedPayslip" class="payslip-overlay" id="payslip-print-area">
      <div class="payslip-print-card">
        <div class="payslip-header">
          <h2>PAYSLIP</h2>
          <div class="payslip-meta">
            <span><strong>Period:</strong> {{ selectedPayslip.period }}</span>
            <span><strong>Employee:</strong> {{ employeeName }}</span>
            <span><strong>Pay Cycle:</strong> {{ selectedPayslip.payCycle }}</span>
            <span><strong>Pay Date:</strong> {{ selectedPayslip.endDate | date:'dd MMM yyyy':'UTC' }}</span>
          </div>
        </div>
        <hr style="margin:1rem 0">
        <div class="ps-section">
          <h4>EARNINGS</h4>
          <div class="ps-row"><span>Basic Salary</span><span>{{ selectedPayslip.baseSalary | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row" *ngIf="selectedPayslip.holidayPay > 0"><span>Holiday Pay</span><span>{{ selectedPayslip.holidayPay | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row" *ngIf="selectedPayslip.bonus > 0"><span>Bonus</span><span>{{ selectedPayslip.bonus | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row gross"><span><strong>GROSS PAY</strong></span><span><strong>{{ selectedPayslip.grossPay | currency:'JMD':'symbol':'1.2-2' }}</strong></span></div>
        </div>
        <div class="ps-section">
          <h4>STATUTORY DEDUCTIONS</h4>
          <div class="ps-row"><span>NIS (3%)</span><span>{{ selectedPayslip.employeeNis | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row"><span>NHT (2%)</span><span>{{ selectedPayslip.employeeNht | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row"><span>Education Tax (2.25%)</span><span>{{ selectedPayslip.employeeEdTax | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row"><span>PAYE</span><span>{{ selectedPayslip.employeePaye | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row" *ngIf="selectedPayslip.loanDeduction > 0"><span>Loan Deduction</span><span>{{ selectedPayslip.loanDeduction | currency:'JMD':'symbol':'1.2-2' }}</span></div>
          <div class="ps-row deductions"><span><strong>TOTAL DEDUCTIONS</strong></span><span><strong>{{ selectedPayslip.deductions | currency:'JMD':'symbol':'1.2-2' }}</strong></span></div>
        </div>
        <div class="ps-net">
          <span>NET PAY</span><span class="net-amount">{{ selectedPayslip.netPay | currency:'JMD':'symbol':'1.2-2' }}</span>
        </div>
        <div class="ps-footer"><em>This is a computer-generated payslip. No signature required.</em></div>
        <div class="ps-actions no-print">
          <button mat-raised-button (click)="printPayslip()"><mat-icon>print</mat-icon> Print</button>
          <button mat-button (click)="showPayslipDetail = false">Close</button>
        </div>
      </div>
    </div>

    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1>Welcome back, {{ employeeName }}!</h1>
          <p>{{ employeeEmail }}</p>
        </div>
        <button mat-raised-button color="warn" class="logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon">event_available</mat-icon>
          <div class="stat-content">
            <h3>{{ leaveBalance }}</h3>
            <p>Days Remaining</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon pending">pending_actions</mat-icon>
          <div class="stat-content">
            <h3>{{ getPendingLeaveCount() }}</h3>
            <p>Pending Requests</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon approved">check_circle</mat-icon>
          <div class="stat-content">
            <h3>{{ getApprovedLeaveCount() }}</h3>
            <p>Approved Requests</p>
          </div>
        </mat-card>
      </div>

      <!-- Main Content Tabs -->
      <mat-tab-group class="content-tabs">
        <!-- Payslips Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>receipt</mat-icon>
            Payslips
          </ng-template>
          <div class="tab-content">
            <div class="tab-header">
              <h2>Pay History</h2>
              <button mat-raised-button color="primary">
                <mat-icon>download</mat-icon>
                Download All
              </button>
            </div>

            <mat-card class="payslip-card">
              @if (payslips.length === 0) {
                <div class="empty-state">
                  <mat-icon>receipt_long</mat-icon>
                  <h3>No payslips available</h3>
                  <p>Your payslips will appear here once generated by your administrator</p>
                  @if (loadingPayslips) { <p><em>Loading...</em></p> }
                  <p style="font-size:0.75rem;color:#aaa;margin-top:0.5rem">Logged in as Employee #{{ employeeId }}</p>
                </div>
              } @else {
                <table mat-table [dataSource]="payslips">
                  <ng-container matColumnDef="period">
                    <th mat-header-cell *matHeaderCellDef>Pay Period</th>
                    <td mat-cell *matCellDef="let payslip">{{ payslip.period }}</td>
                  </ng-container>

                  <ng-container matColumnDef="grossPay">
                    <th mat-header-cell *matHeaderCellDef>Gross Pay</th>
                    <td mat-cell *matCellDef="let payslip">J$ {{ payslip.grossPay | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="deductions">
                    <th mat-header-cell *matHeaderCellDef>Deductions</th>
                    <td mat-cell *matCellDef="let payslip">J$ {{ payslip.deductions | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="netPay">
                    <th mat-header-cell *matHeaderCellDef>Net Pay</th>
                    <td mat-cell *matCellDef="let payslip" class="net-pay">J$ {{ payslip.netPay | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let payslip">
                      <button mat-icon-button matTooltip="View Payslip" (click)="viewPayslip(payslip)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="Print" (click)="viewPayslip(payslip); printPayslip()">
                        <mat-icon>print</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="payslipColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: payslipColumns;"></tr>
                </table>
              }
            </mat-card>
          </div>
        </mat-tab>

        <!-- Leave Requests Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>event_available</mat-icon>
            Leave Requests
          </ng-template>
          <div class="tab-content">
            <div class="tab-header">
              <h2>My Leave Requests</h2>
              <button mat-raised-button color="primary" (click)="openApplyLeaveDialog()">
                <mat-icon>add</mat-icon>
                Apply for Leave
              </button>
            </div>

            <mat-card class="leave-card">
              @if (leaveRequests.length === 0) {
                <div class="empty-state">
                  <mat-icon>event_busy</mat-icon>
                  <h3>No leave requests</h3>
                  <p>You haven't applied for any leave yet</p>
                  <button mat-raised-button color="primary" (click)="openApplyLeaveDialog()">
                    Apply Now
                  </button>
                </div>
              } @else {
                <div class="leave-list">
                  @for (leave of leaveRequests; track leave.id) {
                    <div class="leave-item" [class]="'leave-' + leave.status.toLowerCase()">
                      <div class="leave-info">
                        <div class="leave-header-row">
                          <div class="leave-type-badge">
                            <mat-icon>{{ getLeaveIcon(leave.leaveType) }}</mat-icon>
                            <span>{{ leave.leaveType }}</span>
                          </div>
                          <mat-chip [class]="'status-' + leave.status.toLowerCase()">
                            {{ leave.status }}
                          </mat-chip>
                        </div>
                        <div class="leave-dates">
                          <mat-icon>calendar_today</mat-icon>
                          <span>{{ leave.startDate }} to {{ leave.endDate }}</span>
                          <span class="days-badge">{{ leave.daysRequested }} days</span>
                        </div>
                        @if (leave.reason) {
                          <p class="leave-reason">{{ leave.reason }}</p>
                        }
                        @if (leave.adminNotes && leave.status !== 'Pending') {
                          <div class="admin-notes">
                            <strong>Admin Response:</strong> {{ leave.adminNotes }}
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </mat-card>
          </div>
        </mat-tab>

        <!-- Notices Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>notifications</mat-icon>
            Notices
          </ng-template>
          <div class="tab-content">
            <div class="tab-header">
              <h2>Company Notices</h2>
            </div>

            <mat-card class="notices-card">
              @if (notices.length === 0) {
                <div class="empty-state">
                  <mat-icon>notifications_none</mat-icon>
                  <h3>No notices</h3>
                  <p>You're all caught up! New notices will appear here</p>
                </div>
              } @else {
                <div class="notices-list">
                  @for (notice of notices; track notice.id) {
                    <div class="notice-item" [class]="'notice-' + notice.type">
                      <div class="notice-icon">
                        <mat-icon>{{ getNoticeIcon(notice.type) }}</mat-icon>
                      </div>
                      <div class="notice-content">
                        <h4>{{ notice.title }}</h4>
                        <p>{{ notice.message }}</p>
                        <span class="notice-date">{{ notice.createdAt }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </mat-card>
          </div>
        </mat-tab>

        <!-- Profile Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>person</mat-icon>
            Profile
          </ng-template>
          <div class="tab-content">
            <div class="tab-header">
              <h2>Personal Information</h2>
            </div>

            <mat-card class="profile-card">
              <div class="profile-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="profile-details">
                <div class="detail-row">
                  <label>Full Name</label>
                  <p>{{ employeeName }}</p>
                </div>
                <div class="detail-row">
                  <label>Email</label>
                  <p>{{ employeeEmail }}</p>
                </div>
                <div class="detail-row">
                  <label>Employee Status</label>
                  <mat-chip class="status-active">Active</mat-chip>
                </div>
              </div>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f3f4f6;
      padding: 2rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .welcome-section h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .welcome-section p {
      margin: 0;
      color: #6b7280;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .stat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #667eea;
    }

    .stat-icon.pending {
      color: #f59e0b;
    }

    .stat-icon.approved {
      color: #10b981;
    }

    .stat-content h3 {
      margin: 0 0 0.25rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-content p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .content-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 2rem;
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .tab-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #4b5563;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
    }

    .payslip-card, .leave-card, .notices-card, .profile-card {
      margin-top: 1rem;
    }

    /* Payslip overlay */
    .payslip-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;}
    .payslip-print-card{background:white;width:520px;max-height:90vh;overflow-y:auto;border-radius:8px;padding:2rem;font-family:'Courier New',monospace;}
    .payslip-header{text-align:center;margin-bottom:1rem;}
    .payslip-header h2{font-size:1.5rem;letter-spacing:0.2em;margin:0 0 0.5rem;}
    .payslip-meta{display:flex;flex-direction:column;gap:0.2rem;font-size:0.85rem;color:#555;}
    .ps-section{margin:1rem 0;}
    .ps-section h4{font-size:0.75rem;letter-spacing:0.15em;color:#888;border-bottom:1px dashed #ddd;padding-bottom:0.3rem;margin-bottom:0.5rem;}
    .ps-row{display:flex;justify-content:space-between;padding:0.2rem 0;font-size:0.9rem;}
    .ps-row.gross{border-top:1px solid #ddd;padding-top:0.4rem;margin-top:0.2rem;}
    .ps-row.deductions{border-top:1px solid #ddd;padding-top:0.4rem;margin-top:0.2rem;color:#c62828;}
    .ps-net{display:flex;justify-content:space-between;background:#000;color:white;padding:0.75rem 0.5rem;border-radius:4px;font-size:1.1rem;font-weight:700;margin:1rem 0;}
    .net-amount{color:#C7AE6A;}
    .employer-section h4{color:#aaa;}
    .employer-section .ps-row{color:#777;font-size:0.82rem;}
    .ps-footer{text-align:center;font-size:0.75rem;color:#999;margin:1rem 0;}
    .ps-actions{display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;}
    @media print{.no-print{display:none !important;}.dashboard-container{display:none !important;}.payslip-overlay{position:static;background:none;}.payslip-print-card{box-shadow:none;border-radius:0;max-height:none;}}

    table {
      width: 100%;
    }

    .net-pay {
      font-weight: 700;
      color: #10b981;
    }

    .leave-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .leave-item {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      background: #f9fafb;
    }

    .leave-item.leave-pending {
      border-color: #fbbf24;
      background: #fffbeb;
    }

    .leave-item.leave-approved {
      border-color: #34d399;
      background: #ecfdf5;
    }

    .leave-item.leave-rejected {
      border-color: #f87171;
      background: #fef2f2;
    }

    .leave-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .leave-type-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .leave-type-badge mat-icon {
      color: #667eea;
    }

    .status-pending {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-approved {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-rejected {
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    .status-active {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .leave-dates {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4b5563;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .leave-dates mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .days-badge {
      background: #667eea;
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .leave-reason {
      color: #4b5563;
      font-size: 0.875rem;
      margin: 0.5rem 0;
    }

    .admin-notes {
      background: white;
      padding: 0.75rem;
      border-radius: 6px;
      margin-top: 0.75rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .notices-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notice-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 8px;
      background: #f9fafb;
      border-left: 4px solid #667eea;
    }

    .notice-item.notice-warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }

    .notice-item.notice-error {
      border-left-color: #ef4444;
      background: #fef2f2;
    }

    .notice-icon {
      flex-shrink: 0;
    }

    .notice-icon mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #667eea;
    }

    .notice-content h4 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #1f2937;
    }

    .notice-content p {
      margin: 0 0 0.5rem 0;
      color: #4b5563;
    }

    .notice-date {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .profile-card {
      padding: 2rem;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem auto;
    }

    .profile-avatar mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: white;
    }

    .profile-details {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row label {
      font-weight: 600;
      color: #6b7280;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .detail-row p {
      margin: 0;
      color: #1f2937;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tab-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  employeeName = '';
  employeeEmail = '';
  employeeId = '';
  leaveBalance = 15;
  leaveRequests: LeaveRequest[] = [];
  payslips: any[] = [];
  loadingPayslips = false;
  showPayslipDetail = false;
  selectedPayslip: any = null;
  notices: any[] = [];
  payslipColumns = ['period', 'grossPay', 'deductions', 'netPay', 'actions'];

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load employee info from localStorage
    this.employeeName = localStorage.getItem('employeeName') || 'Employee';
    this.employeeEmail = localStorage.getItem('employeeEmail') || '';
    this.employeeId = localStorage.getItem('employeeId') || '';

    // Load data
    this.loadLeaveRequests();
    this.loadPayslips();
    this.loadNotices();
  }

  loadLeaveRequests() {
    // Mock data for now
    this.leaveRequests = [];
  }

  loadPayslips() {
    this.loadingPayslips = true;
    const token = localStorage.getItem('employeeToken');
    if (!token) {
      console.warn('[Payslips] No employeeToken found in localStorage');
      this.loadingPayslips = false;
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any[]>('/api/employee-portal/payslips', { headers }).subscribe({
      next: data => {
        console.log('[Payslips] Loaded', data.length, 'entries', data);
        this.payslips = data;
        this.loadingPayslips = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('[Payslips] Error loading payslips:', err.status, err.error);
        this.loadingPayslips = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadNotices() {
    // Mock data for now
    this.notices = [];
  }

  viewPayslip(payslip: any) {
    this.selectedPayslip = payslip;
    this.showPayslipDetail = true;
  }

  printPayslip() { window.print(); }

  getPendingLeaveCount(): number {
    return this.leaveRequests.filter(l => l.status === 'Pending').length;
  }

  getApprovedLeaveCount(): number {
    return this.leaveRequests.filter(l => l.status === 'Approved').length;
  }

  getLeaveIcon(leaveType: string): string {
    switch (leaveType.toLowerCase()) {
      case 'vacation': return 'beach_access';
      case 'sick': return 'local_hospital';
      case 'personal': return 'person';
      default: return 'event';
    }
  }

  getNoticeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  }

  openApplyLeaveDialog() {
    const dialogRef = this.dialog.open(ApplyLeaveDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: LeaveRequestDto) => {
      if (result) {
        this.submitLeaveRequest(result);
      }
    });
  }

  submitLeaveRequest(request: LeaveRequestDto) {
    // Submit leave request via API
    console.log('Submitting leave request:', request);
    // Add API call here
  }

  logout() {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeEmail');
    this.router.navigate(['/login']);
  }
}
