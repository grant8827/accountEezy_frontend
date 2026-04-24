import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>assignment</mat-icon>
      Leave Application Form
    </h2>

    <mat-dialog-content class="dialog-content">
      <div class="paper-form" [formGroup]="vacationForm">

        <!-- ── Employee Info Grid (2 columns) ───────────────────── -->
        <div class="info-grid">
          <div class="info-cell">
            <span class="info-label">Employee Name:</span>
            <span class="info-underline">{{ employeeName }}</span>
          </div>
          <div class="info-cell">
            <span class="info-label">Employee No:</span>
            <span class="info-underline">{{ employeeIdNumber || '—' }}</span>
          </div>

          <div class="info-cell">
            <span class="info-label">Designation:</span>
            <input class="paper-input" formControlName="title" />
          </div>
          <div class="info-cell">
            <span class="info-label">Date of Joining:</span>
            <span class="info-underline">{{ hireDate ? (hireDate | date:'MM/dd/yyyy') : '—' }}</span>
          </div>

          <div class="info-cell">
            <span class="info-label">Department:</span>
            <input class="paper-input" formControlName="department" />
          </div>
          <div class="info-cell">
            <span class="info-label">Date of Application:</span>
            <span class="info-underline">{{ today | date:'MM/dd/yyyy' }}</span>
          </div>
        </div>

        <!-- ── Checkbox Section ───────────────────────────────────── -->
        <div class="checkbox-section">
          <div class="checkbox-header">REQUEST FOR: &nbsp;( Please check the box of the desired leave )</div>
          <div class="checkbox-grid">

            <div class="checkbox-item" (click)="selectLeaveType('Vacation')">
              <div class="cb-box" [class.cb-checked]="selectedLeaveType === 'Vacation'">
                @if (selectedLeaveType === 'Vacation') { <mat-icon class="cb-check">check</mat-icon> }
              </div>
              <span class="cb-label">Annual Leave</span>
            </div>

            <div class="checkbox-item" (click)="selectLeaveType('Maternity')">
              <div class="cb-box" [class.cb-checked]="selectedLeaveType === 'Maternity'">
                @if (selectedLeaveType === 'Maternity') { <mat-icon class="cb-check">check</mat-icon> }
              </div>
              <span class="cb-label">Maternity Leave</span>
            </div>

            <div class="checkbox-item" (click)="selectLeaveType('Sick')">
              <div class="cb-box" [class.cb-checked]="selectedLeaveType === 'Sick'">
                @if (selectedLeaveType === 'Sick') { <mat-icon class="cb-check">check</mat-icon> }
              </div>
              <span class="cb-label">Sick / Medical Leave</span>
            </div>

            <div class="checkbox-item" (click)="selectLeaveType('Paternity')">
              <div class="cb-box" [class.cb-checked]="selectedLeaveType === 'Paternity'">
                @if (selectedLeaveType === 'Paternity') { <mat-icon class="cb-check">check</mat-icon> }
              </div>
              <span class="cb-label">Paternity Leave</span>
            </div>

            <div class="checkbox-item others-item" (click)="selectLeaveType('Personal')">
              <div class="cb-box" [class.cb-checked]="selectedLeaveType === 'Personal'">
                @if (selectedLeaveType === 'Personal') { <mat-icon class="cb-check">check</mat-icon> }
              </div>
              <span class="cb-label">Others</span>
              <em class="pl-specify">&nbsp;Pl.specify</em>
              <input class="paper-input other-input" formControlName="otherSpecify"
                     [attr.disabled]="selectedLeaveType !== 'Personal' ? '' : null" />
            </div>

          </div>
        </div>

        <!-- ── Annual Leave balance banner ──────────────────────────── -->
        @if (selectedLeaveType === 'Vacation') {
          <div class="balance-banner">
            <mat-icon>beach_access</mat-icon>
            Annual Leave Balance:&nbsp;<strong>{{ leaveBalance }} day{{ leaveBalance !== 1 ? 's' : '' }}</strong>
          </div>
        }
        @if (selectedLeaveType === 'Vacation' && totalDays > 0 && totalDays > leaveBalance) {
          <div class="warning-banner">
            &#9888; Insufficient vacation days. You are requesting {{ totalDays }} day(s) but only have {{ leaveBalance }} available.
          </div>
        }

        <!-- ── Leave Requested dates ───────────────────────────────── -->
        @if (selectedLeaveType) {
          <div class="dates-section">
            <span class="dates-label">Leave Requested:</span>
            <div class="dates-inline">
              <span class="date-word">From</span>
              <mat-form-field appearance="outline" class="paper-date-field">
                <mat-label>Start</mat-label>
                <input matInput [matDatepicker]="fromPicker" formControlName="startDate" placeholder="MM/DD/YYYY">
                <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                <mat-datepicker #fromPicker></mat-datepicker>
              </mat-form-field>
              <span class="date-word">To</span>
              <mat-form-field appearance="outline" class="paper-date-field">
                <mat-label>End</mat-label>
                <input matInput [matDatepicker]="toPicker" formControlName="endDate" placeholder="MM/DD/YYYY">
                <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
                <mat-datepicker #toPicker></mat-datepicker>
              </mat-form-field>
              <span class="date-word">Total Days</span>
              <span class="total-days-val">{{ totalDays > 0 ? totalDays : '—' }}</span>
            </div>
          </div>
        }

        <!-- ── Sick: medical certificate upload ───────────────────── -->
        @if (selectedLeaveType === 'Sick') {
          <div class="file-upload-section">
            <p class="file-upload-label">
              Medical Certificate <span class="required-star">*</span>
            </p>
            <div class="file-upload-area" [class.has-file]="selectedFile"
                 [class.has-error]="fileError" (click)="fileInput.click()">
              <mat-icon>{{ selectedFile ? 'check_circle' : 'upload_file' }}</mat-icon>
              <span class="file-name">
                {{ selectedFile ? selectedFile.name : 'Click to upload medical certificate' }}
              </span>
              <span class="file-hint">PDF, JPG, PNG — max 5 MB</span>
              <input #fileInput type="file" hidden accept=".pdf,.jpg,.jpeg,.png"
                     (change)="onFileSelected($event)">
            </div>
            @if (fileError) {
              <p class="file-error">{{ fileError }}</p>
            }
          </div>
        }

      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="isSubmitDisabled" (click)="submit()">
        <mat-icon>send</mat-icon>
        Submit Request
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 620px;
      max-width: 720px;
    }

    /* ── Paper form shell ─────────────────────────────── */
    .paper-form {
      border: 1.5px solid #bbb;
      border-radius: 4px;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #fafafa;
      font-family: 'Times New Roman', Times, serif;
    }

    /* ── Info Grid (2-column header) ─────────────────── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem 1.5rem;
    }

    .info-cell {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      border-bottom: 1px solid #bbb;
      padding-bottom: 4px;
    }

    .info-label {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      color: #222;
    }

    .info-underline {
      flex: 1;
      font-size: 13px;
      color: #1a1a1a;
      min-height: 18px;
    }

    .paper-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      font-family: inherit;
      color: #1a1a1a;
      padding: 2px 2px;
      min-width: 0;
    }

    .paper-input:focus { border-bottom: 1px solid #1976d2; }

    /* ── Checkbox section ────────────────────────────── */
    .checkbox-section {
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    .checkbox-header {
      background: #e8e8e8;
      padding: 6px 12px;
      font-size: 12.5px;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #ccc;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 10px 16px;
      row-gap: 10px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .cb-box {
      width: 18px;
      height: 18px;
      border: 2px solid #333;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #fff;
      transition: background 0.15s;
    }

    .cb-box.cb-checked {
      background: #1976d2;
      border-color: #1976d2;
    }

    .cb-check {
      font-size: 13px !important;
      height: 13px !important;
      width: 13px !important;
      color: #fff;
      line-height: 13px !important;
    }

    .cb-label { font-size: 13.5px; color: #222; }
    .pl-specify { font-size: 12px; color: #666; white-space: nowrap; }
    .others-item { grid-column: 1 / -1; }
    .other-input { flex: 1; border-bottom: 1px solid #888; max-width: 220px; }

    /* ── Banners ─────────────────────────────────────── */
    .balance-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e3f2fd;
      border-left: 4px solid #1976d2;
      padding: 8px 14px;
      font-size: 13.5px;
      color: #0d47a1;
      border-radius: 0 4px 4px 0;
    }

    .balance-banner mat-icon { color: #1976d2; font-size: 18px; height: 18px; width: 18px; }

    .warning-banner {
      color: #d32f2f;
      font-size: 13px;
      background: #fff3e0;
      border-left: 3px solid #ff9800;
      padding: 8px 12px;
      border-radius: 4px;
    }

    /* ── Dates section ───────────────────────────────── */
    .dates-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }

    .dates-label { font-size: 13px; font-weight: 600; color: #222; }

    .dates-inline {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .date-word { font-size: 13px; color: #555; white-space: nowrap; }

    .paper-date-field {
      width: 155px;
      font-family: 'Times New Roman', Times, serif;
      font-size: 13px;
    }

    .paper-date-field .mat-mdc-form-field-subscript-wrapper { display: none; }

    .total-days-val { font-size: 15px; font-weight: 600; color: #1a1a1a; min-width: 28px; }

    /* ── File upload ─────────────────────────────────── */
    .file-upload-section { display: flex; flex-direction: column; gap: 6px; }
    .file-upload-label   { margin: 0; font-size: 12px; color: rgba(0,0,0,.6); font-weight: 500; }
    .required-star       { color: #f44336; }

    .file-upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 1.25rem 1rem;
      text-align: center;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: border-color 0.2s, background 0.2s, color 0.2s;
      color: #757575;
    }

    .file-upload-area:hover  { border-color: #1976d2; background: #f0f7ff; color: #1976d2; }
    .file-upload-area mat-icon { font-size: 2.2rem; height: 2.2rem; width: 2.2rem; }
    .file-upload-area.has-file { border-color: #43a047; background: #f1f8f1; color: #2e7d32; }
    .file-upload-area.has-error { border-color: #f44336; background: #fff5f5; }
    .file-name  { font-size: 14px; font-weight: 500; word-break: break-all; }
    .file-hint  { font-size: 11px; color: #aaa; }
    .file-error { margin: 0; font-size: 12px; color: #f44336; }

    @media (max-width: 700px) {
      .dialog-content   { min-width: 90vw; max-width: 95vw; }
      .paper-form       { padding: 1rem; }
      .info-grid        { grid-template-columns: 1fr; }
      .checkbox-grid    { grid-template-columns: 1fr; }
      .paper-date-field { width: 120px; }
    }
  `]
})
export class ApplyLeaveDialogComponent {
  today = new Date();

  selectedLeaveType = '';
  vacationForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;

  get leaveType(): string { return this.selectedLeaveType; }

  get returningDate(): Date | null {
    const end = this.vacationForm.get('endDate')?.value;
    if (!end) return null;
    const d = new Date(end);
    d.setDate(d.getDate() + 1);
    return d;
  }

  get totalDays(): number {
    const start = this.vacationForm.get('startDate')?.value;
    const end   = this.vacationForm.get('endDate')?.value;
    if (!start || !end) return 0;
    const diff = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1;
    return diff > 0 ? diff : 0;
  }

  get isSubmitDisabled(): boolean {
    if (!this.selectedLeaveType) return true;
    const s = this.vacationForm.get('startDate')?.value;
    const e = this.vacationForm.get('endDate')?.value;
    if (!s || !e || this.totalDays < 1) return true;
    if (this.selectedLeaveType === 'Sick' && !this.selectedFile) return true;
    if (this.selectedLeaveType === 'Vacation' && this.totalDays > this.leaveBalance) return true;
    return false;
  }

  employeeName: string;
  employeeIdNumber: string;
  hireDate: Date | null;
  leaveBalance: number;
  private existingLeaveId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplyLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { employeeName: string, employeeIdNumber?: string, hireDate?: string, existingLeave?: any, leaveBalance?: number, position?: string, department?: string }
  ) {
    this.employeeName     = data?.employeeName ?? '';
    this.employeeIdNumber = data?.employeeIdNumber ?? '';
    this.hireDate         = data?.hireDate ? new Date(data.hireDate) : null;
    this.leaveBalance     = data?.leaveBalance ?? 0;
    const existing        = data?.existingLeave;
    this.existingLeaveId  = existing?.id;

    this.selectedLeaveType = existing?.leaveType ?? '';

    const reasonParts  = (existing?.reason ?? '').split(' | ');
    const otherSpecify = existing?.leaveType === 'Personal' ? (existing?.reason ?? '') : '';
    this.vacationForm = this.fb.group({
      title:        [reasonParts[0] || data.position || ''],
      department:   [reasonParts[1] || data.department || ''],
      otherSpecify: [otherSpecify],
      startDate:    [existing?.startDate ? new Date(existing.startDate) : '', Validators.required],
      endDate:      [existing?.endDate   ? new Date(existing.endDate)   : '', Validators.required]
    });
  }

  selectLeaveType(type: string): void {
    this.selectedLeaveType = type;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'File size must not exceed 5 MB';
      this.selectedFile = null;
      return;
    }
    this.fileError = null;
    this.selectedFile = file;
  }

  submit() {
    if (this.isSubmitDisabled) return;

    const v      = this.vacationForm.value;
    const reason = this.selectedLeaveType === 'Personal'
      ? (v.otherSpecify || undefined)
      : ([v.title, v.department].filter(Boolean).join(' | ') || undefined);

    const payload = {
      leaveType:     this.selectedLeaveType,
      startDate:     v.startDate,
      endDate:       v.endDate,
      daysRequested: this.totalDays,
      reason,
      file:          this.selectedLeaveType === 'Sick' ? this.selectedFile : null,
      leaveId:       this.existingLeaveId
    };
    this.dialogRef.close(payload);
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
    MatSnackBarModule,
    CurrencyPipe,
    DatePipe,
    RouterModule
  ],
  template: `
    <!-- Payslip Detail Overlay -->
    <div *ngIf="showPayslipDetail && selectedPayslip" class="payslip-overlay" id="payslip-print-area">
      <div class="payslip-print-card">
        <div class="payslip-biz-header">
          <div class="payslip-logo-box">
            <img *ngIf="selectedPayslip.businessLogoUrl && !payslipLogoError" [src]="selectedPayslip.businessLogoUrl" alt="logo" (error)="payslipLogoError = true">
            <span *ngIf="!selectedPayslip.businessLogoUrl || payslipLogoError">{{ getInitials(selectedPayslip.businessName) }}</span>
          </div>
          <div class="payslip-biz-info">
            <div class="payslip-biz-name">{{ selectedPayslip.businessName }}</div>
            <div class="payslip-biz-detail" *ngIf="selectedPayslip.businessAddress">{{ selectedPayslip.businessAddress }}</div>
            <div class="payslip-biz-detail" *ngIf="selectedPayslip.businessEmail">{{ selectedPayslip.businessEmail }}</div>
            <div class="payslip-biz-detail" *ngIf="selectedPayslip.businessPhone">{{ selectedPayslip.businessPhone }}</div>
          </div>
        </div>
        <div class="payslip-title-section">
          <h2>Payslip</h2>
          <div class="payslip-period"><strong>Pay Period:</strong> {{ selectedPayslip.period }}</div>
        </div>
        <div class="payslip-emp-section">
          <div><span class="payslip-emp-label">Employee Name:</span> {{ employeeName }}</div>
          <div><span class="payslip-emp-label">Position:</span> {{ selectedPayslip.position || '—' }}</div>
        </div>
        <hr style="margin:0.75rem 0">
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
          <div class="ytd-table">
            <div class="ytd-label">Y.T.D.</div>
            <hr class="ytd-divider">
            <div class="ytd-row ytd-header ytd-gross-row">
              <span>GROSS</span>
            </div>
            <div class="ytd-row ytd-data ytd-gross-row">
              <span>{{ selectedPayslip.ytdGross | currency:'JMD':'symbol':'1.2-2' }}</span>
            </div>
            <div class="ytd-row ytd-header ytd-ded-row">
              <span>EDTAX</span><span>NHT</span><span>NIS</span><span>PAYE</span>
            </div>
            <div class="ytd-row ytd-data ytd-ded-row">
              <span>{{ selectedPayslip.ytdEdTax | currency:'JMD':'symbol':'1.2-2' }}</span>
              <span>{{ selectedPayslip.ytdNht | currency:'JMD':'symbol':'1.2-2' }}</span>
              <span>{{ selectedPayslip.ytdNis | currency:'JMD':'symbol':'1.2-2' }}</span>
              <span>{{ selectedPayslip.ytdPaye | currency:'JMD':'symbol':'1.2-2' }}</span>
            </div>
            <div class="ytd-row ytd-header ytd-gross-row">
              <span>TOT. DEDUCTIONS</span>
            </div>
            <div class="ytd-row ytd-data ytd-gross-row">
              <span>{{ selectedPayslip.ytdTotalDeductions | currency:'JMD':'symbol':'1.2-2' }}</span>
            </div>
            <hr class="ytd-divider">
          </div>
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

      <!-- Quick Stats (hidden - moved into Overview tab) -->

      <!-- Main Content Tabs -->
      <mat-tab-group class="content-tabs" [selectedIndex]="selectedTabIndex" (selectedIndexChange)="onTabChange($event)">
        <!-- Overview Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>dashboard</mat-icon>
            Overview
          </ng-template>
          <div class="tab-content">
            <div class="tab-header">
              <h2>Welcome back, {{ employeeName }}!</h2>
            </div>
            <div class="stats-grid">
              <mat-card class="stat-card">
                <mat-icon class="stat-icon">event_available</mat-icon>
                <div class="stat-content">
                  <h3>{{ leaveBalance }}</h3>
                  <p>Leave Days Remaining</p>
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
              <mat-card class="stat-card">
                <mat-icon class="stat-icon">receipt_long</mat-icon>
                <div class="stat-content">
                  <h3>{{ payslips.length }}</h3>
                  <p>Total Payslips</p>
                </div>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Payslips Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>receipt</mat-icon>
            Payslips
          </ng-template>
          <div class="tab-content">
            <div class="tab-header">
              <h2>Pay History</h2>
              <button mat-raised-button color="primary" (click)="downloadAllPayslips()">
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
                        @if (leave.status === 'Pending') {
                          <div class="leave-edit-row">
                            <button mat-stroked-button (click)="editLeave(leave)">
                              <mat-icon>edit</mat-icon> Edit Request
                            </button>
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
                        <h4>{{ notice.title }} <span *ngIf="notice.priority === 'high'" class="notice-priority-badge">High Priority</span></h4>
                        <p>{{ notice.message }}</p>
                        <span class="notice-date">{{ notice.createdAt | date:'dd MMM yyyy' }} · {{ notice.category }}</span>
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
    .payslip-biz-header{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.5rem;}
    .payslip-logo-box{width:64px;height:64px;min-width:64px;background:#222;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.3rem;overflow:hidden;letter-spacing:0.05em;}
    .payslip-logo-box img{width:100%;height:100%;object-fit:contain;}
    .payslip-biz-info{flex:1;}
    .payslip-biz-name{font-size:1.3rem;font-weight:700;line-height:1.2;}
    .payslip-biz-detail{font-size:0.78rem;color:#555;line-height:1.4;}
    .payslip-title-section{text-align:center;margin:1.25rem 0 0.75rem;}
    .payslip-title-section h2{font-size:1.4rem;letter-spacing:0.12em;margin:0 0 0.25rem;font-weight:700;}
    .payslip-period{font-size:0.85rem;font-weight:600;}
    .payslip-emp-section{border-left:3px solid #ddd;padding-left:0.75rem;margin:0.75rem 0;font-size:0.85rem;}
    .payslip-emp-section div{padding:0.1rem 0;}
    .payslip-emp-label{font-weight:700;}
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
    .ytd-table{margin:0.75rem 0;font-size:0.72rem;}
    .ytd-label{font-size:0.7rem;font-weight:700;color:#888;letter-spacing:0.06em;margin-bottom:0.2rem;}
    .ytd-divider{border:none;border-top:1px solid #ddd;margin:0 0 0.3rem 0;}
    .ytd-row{display:grid;}
    .ytd-gross-row{grid-template-columns:1fr;}
    .ytd-ded-row{grid-template-columns:repeat(4,1fr);}
    .ytd-row span{padding:0.25rem 0.25rem;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .ytd-gross-row span{text-align:left;font-size:0.82rem;}
    .ytd-header{font-weight:700;font-size:0.68rem;color:#888;letter-spacing:0.04em;}
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

    .leave-edit-row {
      margin-top: 0.75rem;
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

    .notice-priority-badge {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      background: #fee2e2;
      color: #dc2626;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      margin-left: 0.5rem;
      vertical-align: middle;
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
  employeePosition = '';
  employeeDepartment = '';
  employeeIdNumber = '';
  hireDate: string | null = null;
  leaveBalance = 0;
  leaveRequests: LeaveRequest[] = [];
  payslips: any[] = [];
  loadingPayslips = false;
  selectedTabIndex = 0;

  private readonly routeToTab: Record<string, number> = {
    overview: 0, payslips: 1, leaves: 2, notices: 3, profile: 4
  };
  private readonly tabToRoute: string[] = ['overview', 'payslips', 'leaves', 'notices', 'profile'];
  showPayslipDetail = false;
  payslipLogoError = false;
  selectedPayslip: any = null;
  notices: any[] = [];
  payslipColumns = ['period', 'grossPay', 'deductions', 'netPay', 'actions'];

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const segment = e.urlAfterRedirects.split('/').pop()?.split('?')[0] ?? 'overview';
      this.selectedTabIndex = this.routeToTab[segment] ?? 0;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.employeeName = localStorage.getItem('employeeName') || 'Employee';
    this.employeeEmail = localStorage.getItem('employeeEmail') || '';
    this.employeeId = localStorage.getItem('employeeId') || '';

    // Set active tab from current URL
    const segment = this.router.url.split('/').pop()?.split('?')[0] ?? 'overview';
    this.selectedTabIndex = this.routeToTab[segment] ?? 0;

    this.loadProfile();
    this.loadLeaveRequests();
    this.loadPayslips();
    this.loadNotices();
  }

  onTabChange(index: number) {
    const route = this.tabToRoute[index] ?? 'overview';
    this.router.navigate(['/employee-dashboard', route]);
  }

  loadProfile() {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any>(`${environment.apiUrl}/employee-portal/profile`, { headers }).subscribe({
      next: (data) => {
        this.employeePosition   = data.position ?? '';
        this.employeeDepartment = data.department ?? '';
        this.employeeIdNumber   = data.employeeIdNumber ?? '';
        this.hireDate           = data.hireDate ?? null;
      }
    });
  }

  loadLeaveRequests() {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any>(environment.apiUrl + '/employee-portal/leaves', { headers }).subscribe({
      next: data => {
        this.leaveRequests = data.leaves ?? data;
        this.leaveBalance = data.vacationDaysBalance ?? 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
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
    this.http.get<any[]>(environment.apiUrl + '/employee-portal/payslips', { headers }).subscribe({
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

  downloadAllPayslips() {
    if (!this.payslips.length) return;

    const rows = this.payslips.map(p => `
      <tr>
        <td>${p.period ?? p.payPeriod ?? ''}</td>
        <td>$${(p.grossPay ?? 0).toFixed(2)}</td>
        <td>$${(p.deductions ?? 0).toFixed(2)}</td>
        <td>$${(p.netPay ?? 0).toFixed(2)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html><head><title>Pay History – ${this.employeeName}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; }
  h2 { margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
  th { background: #f5f5f5; }
</style></head>
<body>
  <h2>Pay History – ${this.employeeName}</h2>
  <table>
    <thead><tr><th>Period</th><th>Gross Pay</th><th>Deductions</th><th>Net Pay</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body></html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  loadNotices() {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any[]>(environment.apiUrl + '/employee-portal/notices', { headers }).subscribe({
      next: data => this.notices = data,
      error: () => {} // silently fail — empty state is shown
    });
  }

  viewPayslip(payslip: any) {
    this.selectedPayslip = payslip;
    this.payslipLogoError = false;
    this.showPayslipDetail = true;
  }

  printPayslip() {
    // Defer so Angular change detection renders the overlay before we query the DOM
    setTimeout(() => {
      const card = document.querySelector<HTMLElement>('.payslip-print-card');
      if (!card) return;

      const win = window.open('', '_blank', 'width=700,height=900');
      if (!win) return;

      win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Payslip</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; margin: 2rem; color: #111; }
    .ps-actions { display: none !important; }
    .payslip-biz-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
    .payslip-logo-box { width: 64px; height: 64px; min-width: 64px; background: #222; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.3rem; overflow: hidden; letter-spacing: 0.05em; }
    .payslip-logo-box img { width: 100%; height: 100%; object-fit: contain; }
    .payslip-biz-info { flex: 1; }
    .payslip-biz-name { font-size: 1.3rem; font-weight: 700; line-height: 1.2; }
    .payslip-biz-detail { font-size: 0.78rem; color: #555; line-height: 1.4; }
    .payslip-title-section { text-align: center; margin: 1.25rem 0 0.75rem; }
    .payslip-title-section h2 { font-size: 1.4rem; letter-spacing: 0.12em; margin: 0 0 0.25rem; font-weight: 700; }
    .payslip-period { font-size: 0.85rem; font-weight: 600; }
    .payslip-emp-section { border-left: 3px solid #ddd; padding-left: 0.75rem; margin: 0.75rem 0; font-size: 0.85rem; }
    .payslip-emp-section div { padding: 0.1rem 0; }
    .payslip-emp-label { font-weight: 700; }
    .ps-section { margin: 1rem 0; }
    .ps-section h4 { font-size: 0.75rem; letter-spacing: 0.15em; color: #888; border-bottom: 1px dashed #ddd; padding-bottom: 0.3rem; margin-bottom: 0.5rem; }
    .ps-row { display: flex; justify-content: space-between; padding: 0.2rem 0; font-size: 0.9rem; }
    .ps-row.gross { border-top: 1px solid #ddd; padding-top: 0.4rem; margin-top: 0.2rem; }
    .ps-row.deductions { border-top: 1px solid #ddd; padding-top: 0.4rem; margin-top: 0.2rem; color: #c62828; }
    .ps-net { display: flex; justify-content: space-between; background: #000; color: white; padding: 0.75rem 0.5rem; font-size: 1.1rem; font-weight: 700; margin: 1rem 0; }
    .net-amount { color: #C7AE6A; }
    .ps-footer { text-align: center; font-size: 0.75rem; color: #999; margin: 1rem 0; }
    hr { border: none; border-top: 1px solid #ddd; margin: 1rem 0; }
  </style>
</head>
<body>${card.innerHTML}</body>
</html>`);

      win.document.close();
      win.focus();
      win.print();
      setTimeout(() => win.close(), 1000);
    }, 50);
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  }

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
      width: '720px',
      maxWidth: '95vw',
      data: { employeeName: this.employeeName, leaveBalance: this.leaveBalance, position: this.employeePosition, department: this.employeeDepartment, employeeIdNumber: this.employeeIdNumber, hireDate: this.hireDate }
    });

    dialogRef.afterClosed().subscribe((result: LeaveRequestDto & { file?: File | null }) => {
      if (result) {
        this.submitLeaveRequest(result);
      }
    });
  }

  editLeave(leave: any) {
    const dialogRef = this.dialog.open(ApplyLeaveDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: { employeeName: this.employeeName, existingLeave: leave, leaveBalance: this.leaveBalance, position: this.employeePosition, department: this.employeeDepartment, employeeIdNumber: this.employeeIdNumber, hireDate: this.hireDate }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.submitLeaveRequest(result);
      }
    });
  }

  submitLeaveRequest(request: LeaveRequestDto & { file?: File | null, leaveId?: number }) {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const { file, leaveId, ...leaveDto } = request as any;
    const isEdit = !!leaveId;
    const url = isEdit
      ? environment.apiUrl + `/leaverequests/${leaveId}`
      : environment.apiUrl + '/leaverequests';
    const successMsg = isEdit ? 'Leave request updated!' : 'Leave request submitted successfully!';

    if (file) {
      // Upload the medical certificate first, then submit the leave request
      const formData = new FormData();
      formData.append('document', file);
      this.http.post<{ documentPath: string }>(
        environment.apiUrl + '/leaverequests/upload-document',
        formData,
        { headers }
      ).subscribe({
        next: (res) => {
          const body = { ...leaveDto, documentPath: res.documentPath };
          (isEdit ? this.http.put(url, body, { headers }) : this.http.post(url, body, { headers })).subscribe({
            next: () => {
              this.snackBar.open(successMsg, 'Close', { duration: 3500 });
              this.loadLeaveRequests();
            },
            error: err => {
              console.error('Leave request failed:', err);
              this.snackBar.open('Failed to submit leave request. Please try again.', 'Close', { duration: 4000 });
            }
          });
        },
        error: err => console.error('Document upload failed:', err)
      });
    } else {
      (isEdit ? this.http.put(url, leaveDto, { headers }) : this.http.post(url, leaveDto, { headers })).subscribe({
        next: () => {
          this.snackBar.open(successMsg, 'Close', { duration: 3500 });
          this.loadLeaveRequests();
        },
        error: err => {
          console.error('Leave request failed:', err);
          this.snackBar.open('Failed to submit leave request. Please try again.', 'Close', { duration: 4000 });
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeEmail');
    this.router.navigate(['/login']);
  }
}
