import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../services/employee.service';
import { Employee as AppEmployee } from '../../types/index';

// ── Interfaces ─────────────────────────────────────────────────────────────────

interface PayrollBatchSummary {
  id: number; label: string; payCycle: string;
  startDate: string; endDate: string; payDate?: string;
  status: number; createdAt: string;
  employeeCount: number; totalNet: number; totalRemittance: number;
}

interface BatchEntryInput {
  employeeId: number; name: string; baseSalary: number;
  holidayPay: number; bonus: number; loanDeduction: number;
  employmentType: string; hourlyRate: number; hours: number;
}

interface PayrollEntry {
  id: number; employeeId: number;
  employee: { id: number; name: string; nisNumber: string; position: string | null; ytdGross: number; ytdNis: number; ytdNht: number; ytdEducationTax: number; ytdPaye: number; ytdTotalDeductions: number; };
  baseSalary: number; holidayPay: number; bonus: number; grossPay: number;
  employeeNis: number; employeeNht: number; employeeEducationTax: number; employeePaye: number;
  loanDeduction: number;
  employerNis: number; employerNht: number; employerEducationTax: number; employerHeart: number;
  totalStatutoryDeductions: number; totalDeductions: number; netPay: number;
}

interface PayrollBatchDetail {
  id: number; label: string; payCycle: string;
  startDate: string; endDate: string; status: number;
  business: { companyName: string; address: string; businessEmail: string | null; businessPhone: string | null; logoUrl: string | null; } | null;
  entries: PayrollEntry[];
}

interface RemittanceReport {
  batchId: number; label: string; period: string; employeeCount: number;
  totalGross: number; totalNet: number;
  totalEmployeeNis: number; totalEmployeeNht: number; totalEmployeeEdTax: number; totalEmployeePaye: number;
  totalLoanDeductions: number;
  totalEmployerNis: number; totalEmployerNht: number; totalEmployerEdTax: number; totalEmployerHeart: number;
  totalNisRemittance: number; totalNhtRemittance: number; totalEdTaxRemittance: number;
  totalPayeRemittance: number; totalHeartRemittance: number; grandTotalRemittance: number;
}

interface TaxConfig {
  id?: number; businessId?: number;
  nisRateEmployee: number; nhtRateEmployee: number; educationTaxRateEmployee: number;
  payeRateLower: number; payeRateUpper: number;
  nisRateEmployer: number; nhtRateEmployer: number; educationTaxRateEmployer: number;
  heartRateEmployer: number;
  incomeTaxThresholdAnnual: number; payeUpperBandAnnual: number; nisAnnualCeiling: number;
}

const DEFAULT_TAX: TaxConfig = {
  nisRateEmployee: 0.03, nhtRateEmployee: 0.02, educationTaxRateEmployee: 0.0225,
  payeRateLower: 0.25, payeRateUpper: 0.30,
  nisRateEmployer: 0.03, nhtRateEmployer: 0.03, educationTaxRateEmployer: 0.035,
  heartRateEmployer: 0.03,
  incomeTaxThresholdAnnual: 1902360, payeUpperBandAnnual: 6000000, nisAnnualCeiling: 6000000
};

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-payroll-module',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CurrencyPipe, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule, MatTooltipModule
  ],
  template: `
<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!--  PAYSLIP OVERLAY (PAY-8)                                                   -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<div *ngIf="showPayslip && payslipEntry" class="payslip-overlay" id="payslip-print-area">
  <div class="payslip-card">
    <div class="payslip-biz-header">
      <div class="payslip-logo-box">
        <img *ngIf="payslipBatch?.business?.logoUrl && !payslipLogoError" [src]="payslipBatch?.business?.logoUrl" alt="logo" (error)="payslipLogoError = true">
        <span *ngIf="!payslipBatch?.business?.logoUrl || payslipLogoError">{{ getInitials(payslipBatch?.business?.companyName) }}</span>
      </div>
      <div class="payslip-biz-info">
        <div class="payslip-biz-name">{{ payslipBatch?.business?.companyName }}</div>
        <div class="payslip-biz-detail" *ngIf="payslipBatch?.business?.address">{{ payslipBatch?.business?.address }}</div>
        <div class="payslip-biz-detail" *ngIf="payslipBatch?.business?.businessEmail">{{ payslipBatch?.business?.businessEmail }}</div>
        <div class="payslip-biz-detail" *ngIf="payslipBatch?.business?.businessPhone">{{ payslipBatch?.business?.businessPhone }}</div>
      </div>
    </div>
    <div class="payslip-title-section">
      <h2>Payslip</h2>
      <div class="payslip-period"><strong>Pay Period:</strong> {{ payslipBatch?.label }}</div>
    </div>
    <div class="payslip-emp-section">
      <div><span class="payslip-emp-label">Employee Name:</span> {{ payslipEntry.employee.name }}</div>
      <div><span class="payslip-emp-label">Position:</span> {{ payslipEntry.employee.position || '—' }}</div>
    </div>
    <mat-divider></mat-divider>
    <div class="payslip-body">
      <div class="payslip-section">
        <h4>EARNINGS</h4>
        <div class="payslip-row"><span>Basic Salary</span><span>{{ payslipEntry.baseSalary | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row" *ngIf="payslipEntry.holidayPay > 0"><span>Holiday Pay</span><span>{{ payslipEntry.holidayPay | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row" *ngIf="payslipEntry.bonus > 0"><span>Bonus</span><span>{{ payslipEntry.bonus | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row gross-row"><span><strong>GROSS PAY</strong></span><span><strong>{{ payslipEntry.grossPay | currency:'JMD':'symbol':'1.2-2' }}</strong></span></div>
      </div>
      <div class="payslip-section">
        <h4>STATUTORY DEDUCTIONS</h4>
        <div class="payslip-row"><span>NIS (3%)</span><span>{{ payslipEntry.employeeNis | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row"><span>NHT (2%)</span><span>{{ payslipEntry.employeeNht | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row"><span>Education Tax (2.25%)</span><span>{{ payslipEntry.employeeEducationTax | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row"><span>PAYE</span><span>{{ payslipEntry.employeePaye | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row" *ngIf="payslipEntry.loanDeduction > 0"><span>Loan Deduction</span><span>{{ payslipEntry.loanDeduction | currency:'JMD':'symbol':'1.2-2' }}</span></div>
        <div class="payslip-row deductions-row"><span><strong>TOTAL DEDUCTIONS</strong></span><span><strong>{{ payslipEntry.totalDeductions | currency:'JMD':'symbol':'1.2-2' }}</strong></span></div>
        <div class="ytd-table">
          <div class="ytd-label">Y.T.D.</div>
          <hr class="ytd-divider">
          <div class="ytd-row ytd-header ytd-gross-row">
            <span>GROSS</span>
          </div>
          <div class="ytd-row ytd-data ytd-gross-row">
            <span>{{ payslipEntry.employee.ytdGross | currency:'JMD':'symbol':'1.2-2' }}</span>
          </div>
          <div class="ytd-row ytd-header ytd-ded-row">
            <span>EDTAX</span><span>NHT</span><span>NIS</span><span>PAYE</span>
          </div>
          <div class="ytd-row ytd-data ytd-ded-row">
            <span>{{ payslipEntry.employee.ytdEducationTax | currency:'JMD':'symbol':'1.2-2' }}</span>
            <span>{{ payslipEntry.employee.ytdNht | currency:'JMD':'symbol':'1.2-2' }}</span>
            <span>{{ payslipEntry.employee.ytdNis | currency:'JMD':'symbol':'1.2-2' }}</span>
            <span>{{ payslipEntry.employee.ytdPaye | currency:'JMD':'symbol':'1.2-2' }}</span>
          </div>
          <div class="ytd-row ytd-header ytd-gross-row">
            <span>TOT. DEDUCTIONS</span>
          </div>
          <div class="ytd-row ytd-data ytd-gross-row">
            <span>{{ payslipEntry.employee.ytdTotalDeductions | currency:'JMD':'symbol':'1.2-2' }}</span>
          </div>
          <hr class="ytd-divider">
        </div>
      </div>
      <div class="payslip-net">
        <span>NET PAY</span>
        <span class="net-amount">{{ payslipEntry.netPay | currency:'JMD':'symbol':'1.2-2' }}</span>
      </div>
    </div>
    <div class="payslip-footer">
      <em>This is a computer-generated payslip. No signature required.</em>
    </div>
    <div class="payslip-actions no-print">
      <button mat-raised-button (click)="printPayslip()"><mat-icon>print</mat-icon> Print</button>
      <button mat-button (click)="closePayslip()">Close</button>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!--  MAIN PAGE                                                                 -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<div class="payroll-module">

  <!-- Page Header -->
  <div class="page-header">
    <div>
      <h1><mat-icon class="title-icon">payments</mat-icon> J-PAY Payroll</h1>
      <p class="subtitle">Jamaican Statutory Payroll Compliance</p>
    </div>
    <div class="header-actions">
      <button mat-raised-button class="gold-btn" (click)="switchTab(0)">
        <mat-icon>calendar_month</mat-icon> Pay Periods
      </button>
      <button mat-raised-button class="gold-btn" (click)="openNewBatchForm()">
        <mat-icon>add</mat-icon> New Pay Period
      </button>
    </div>
  </div>

  <!-- Tab Group -->
  <mat-tab-group [(selectedIndex)]="activeTab" animationDuration="200ms">

    <!-- ──────────────────────────────────── TAB 1: Pay Periods ─────────────── -->
    <mat-tab>
      <ng-template mat-tab-label><mat-icon>date_range</mat-icon>&nbsp;Pay Periods</ng-template>

      <!-- New Batch Form -->
      <mat-card *ngIf="showNewBatchForm" class="form-card">
        <mat-card-header><mat-card-title>Create New Pay Period</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Label (optional)</mat-label>
              <input matInput [(ngModel)]="newBatch.label" placeholder="Auto-filled from Pay Date">
              <mat-hint>Leave blank to auto-fill from pay date</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Pay Cycle</mat-label>
              <mat-select [(ngModel)]="newBatch.payCycle">
                <mat-option value="Weekly">Weekly</mat-option>
                <mat-option value="Fortnightly">Fortnightly</mat-option>
                <mat-option value="Monthly">Monthly</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" [(ngModel)]="newBatch.startDate">
              <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" [(ngModel)]="newBatch.endDate">
              <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Pay Date</mat-label>
              <input matInput [matDatepicker]="payDatePicker" [(ngModel)]="newBatch.payDate" (ngModelChange)="onPayDateChange($event)">
              <mat-datepicker-toggle matIconSuffix [for]="payDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #payDatePicker></mat-datepicker>
              <mat-hint>Date employees will be paid — determines the payroll month</mat-hint>
            </mat-form-field>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button class="gold-btn" (click)="createBatch()" [disabled]="creating">
            <mat-spinner *ngIf="creating" diameter="18"></mat-spinner>
            <mat-icon *ngIf="!creating">check</mat-icon>
            {{ creating ? 'Creating…' : 'Create Pay Period' }}
          </button>
          <button mat-button (click)="showNewBatchForm = false">Cancel</button>
        </mat-card-actions>
      </mat-card>

      <!-- Batches List -->
      <mat-card class="list-card">
        <mat-card-content>
          <div *ngIf="loadingBatches" class="center-spinner"><mat-spinner diameter="40"></mat-spinner></div>
          <div *ngIf="!loadingBatches && batches.length === 0" class="empty-state">
            <mat-icon class="empty-icon">inbox</mat-icon>
            <p>No pay periods yet. Create your first pay period above.</p>
          </div>
          <table mat-table [dataSource]="batches" *ngIf="!loadingBatches && batches.length > 0" class="full-table">
            <ng-container matColumnDef="label">
              <th mat-header-cell *matHeaderCellDef>Period</th>
              <td mat-cell *matCellDef="let b">
                <strong>{{ b.label }}</strong><br>
                <small class="muted">{{ b.startDate | date:'dd MMM' }} – {{ b.endDate | date:'dd MMM yyyy' }}</small>
                <span *ngIf="b.payDate"><br><small class="pay-date-label"><mat-icon style="font-size:11px;vertical-align:middle;width:12px;height:12px">payments</mat-icon> Pay date: {{ b.payDate | date:'dd MMM yyyy' }}</small></span>
              </td>
            </ng-container>
            <ng-container matColumnDef="payCycle">
              <th mat-header-cell *matHeaderCellDef>Cycle</th>
              <td mat-cell *matCellDef="let b">{{ b.payCycle }}</td>
            </ng-container>
            <ng-container matColumnDef="employees">
              <th mat-header-cell *matHeaderCellDef># Employees</th>
              <td mat-cell *matCellDef="let b">{{ b.employeeCount }}</td>
            </ng-container>
            <ng-container matColumnDef="totalNet">
              <th mat-header-cell *matHeaderCellDef>Total Net Pay</th>
              <td mat-cell *matCellDef="let b">{{ b.totalNet | currency:'JMD':'symbol':'1.2-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="totalRemittance">
              <th mat-header-cell *matHeaderCellDef>Statutory Remittance</th>
              <td mat-cell *matCellDef="let b">{{ b.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let b">
                <span class="status-chip" [class]="'status-' + b.status">{{ statusLabel(b.status) }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let b">
                <button mat-icon-button matTooltip="Run Payroll" *ngIf="b.status === 0" (click)="selectBatchForProcessing(b)">
                  <mat-icon>play_circle</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Edit / Reprocess" *ngIf="b.status === 1" (click)="selectBatchForEditing(b)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="View Payslips" *ngIf="b.status > 0" (click)="loadBatchDetail(b.id, true)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Remittance Report" *ngIf="b.status > 0" (click)="loadRemittance(b.id)">
                  <mat-icon>receipt_long</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Mark as Paid" *ngIf="b.status === 1" (click)="markPaid(b.id)">
                  <mat-icon>paid</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Delete" *ngIf="b.status !== 2" (click)="deleteBatch(b.id)" class="delete-btn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="batchColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: batchColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </mat-tab>

    <!-- ──────────────────────────────────── TAB 2: Run Payroll ─────────────── -->
    <mat-tab [disabled]="!activeBatch && !processedBatch">
      <ng-template mat-tab-label><mat-icon>calculate</mat-icon>&nbsp;Run Payroll</ng-template>

      <div *ngIf="!activeBatch && !processedBatch" class="empty-state">
        <mat-icon class="empty-icon">touch_app</mat-icon>
        <p>Select a Draft pay period from the <strong>Pay Periods</strong> tab and click <mat-icon style="font-size:1rem;vertical-align:middle">play_circle</mat-icon> <strong>Run Payroll</strong> to load employees here.</p>
      </div>

      <ng-container *ngIf="activeBatch">
        <mat-card class="batch-info-card">
          <mat-card-content>
            <div class="batch-info-row">
              <span><mat-icon>event</mat-icon> <strong>{{ activeBatch.label }}</strong></span>
              <span class="muted">{{ activeBatch.startDate | date:'dd MMM yyyy' }} – {{ activeBatch.endDate | date:'dd MMM yyyy' }}</span>
              <span><mat-icon>sync</mat-icon> {{ activeBatch.payCycle }}</span>
              <span class="status-chip" [class]="'status-' + activeBatch.status">{{ statusLabel(activeBatch.status) }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="worksheet-card">
          <mat-card-header>
            <mat-card-title>Employee Worksheet</mat-card-title>
            <mat-card-subtitle>Enter any additional earnings or deductions. Base salary is loaded automatically.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="loadingEmployees" class="center-spinner"><mat-spinner diameter="40"></mat-spinner></div>
            <div *ngIf="!loadingEmployees && worksheetEntries.length === 0" class="empty-state">
              <mat-icon>group_off</mat-icon>
              <p>No active employees found. Add employees first.</p>
            </div>
            <div class="worksheet-table-wrap" *ngIf="worksheetEntries.length > 0">
              <table class="worksheet-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th class="num-col">Type</th>
                    <th class="num-col">Hours</th>
                    <th class="num-col">Base Salary (J$)</th>
                    <th class="num-col">Holiday Pay (J$)</th>
                    <th class="num-col">Bonus (J$)</th>
                    <th class="num-col">Loan Deduction (J$)</th>
                    <th class="num-col">Est. Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let e of worksheetEntries">
                    <td><strong>{{ e.name }}</strong></td>
                    <td class="num-col">
                      <span [style.color]="e.employmentType === 'Hourly' ? '#e65100' : '#1565c0'" style="font-size:12px; font-weight:600;">
                        {{ e.employmentType === 'Hourly' ? 'Hourly' : 'Salary' }}
                      </span>
                    </td>
                    <td class="num-col">
                      <ng-container *ngIf="e.employmentType === 'Hourly'; else noHours">
                        <input type="number" class="ws-input" [(ngModel)]="e.hours" min="0"
                               (ngModelChange)="recalcEstimate(e)" placeholder="0">
                      </ng-container>
                      <ng-template #noHours><span style="color:#aaa;">—</span></ng-template>
                    </td>
                    <td class="num-col">
                      <ng-container *ngIf="e.employmentType === 'Hourly'; else showBase">
                        {{ (e.hours || 0) * e.hourlyRate | currency:'JMD':'symbol':'1.2-2' }}
                        <span style="display:block; font-size:10px; color:#888;">{{ e.hours || 0 }}h x J&#36;{{ e.hourlyRate.toFixed(2) }}/hr</span>
                      </ng-container>
                      <ng-template #showBase>{{ e.baseSalary | currency:'JMD':'symbol':'1.2-2' }}</ng-template>
                    </td>
                    <td class="num-col">
                      <input type="number" class="ws-input" [(ngModel)]="e.holidayPay" min="0"
                             (ngModelChange)="recalcEstimate(e)" placeholder="0">
                    </td>
                    <td class="num-col">
                      <input type="number" class="ws-input" [(ngModel)]="e.bonus" min="0"
                             (ngModelChange)="recalcEstimate(e)" placeholder="0">
                    </td>
                    <td class="num-col">
                      <input type="number" class="ws-input" [(ngModel)]="e.loanDeduction" min="0" placeholder="0">
                    </td>
                    <td class="num-col est-net">
                      {{ estimateNetPay(e) | currency:'JMD':'symbol':'1.2-2' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mat-card-content>
          <mat-card-actions *ngIf="worksheetEntries.length > 0">
            <button mat-raised-button class="gold-btn run-btn" (click)="processBatch()" [disabled]="processing">
              <mat-spinner *ngIf="processing" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!processing">rocket_launch</mat-icon>
              {{ processing ? 'Processing…' : (activeBatch.status === 1 ? 'Reprocess' : 'Run') + ' Payroll for ' + worksheetEntries.length + ' Employees' }}
            </button>
          </mat-card-actions>
        </mat-card>
      </ng-container>

      <!-- Results after processing -->
      <ng-container *ngIf="processedBatch">
        <mat-card class="results-card">
          <mat-card-header>
            <mat-card-title><mat-icon>check_circle</mat-icon> Payroll Processed Successfully</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="processedBatch.entries" class="full-table results-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Employee</th>
                <td mat-cell *matCellDef="let e">{{ e.employee?.name ?? '—' }}</td>
              </ng-container>
              <ng-container matColumnDef="gross">
                <th mat-header-cell *matHeaderCellDef>Gross Pay</th>
                <td mat-cell *matCellDef="let e">{{ e.grossPay | currency:'JMD':'symbol':'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="nis">
                <th mat-header-cell *matHeaderCellDef>NIS</th>
                <td mat-cell *matCellDef="let e">{{ e.employeeNis | currency:'JMD':'symbol':'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="nht">
                <th mat-header-cell *matHeaderCellDef>NHT</th>
                <td mat-cell *matCellDef="let e">{{ e.employeeNht | currency:'JMD':'symbol':'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="edtax">
                <th mat-header-cell *matHeaderCellDef>Ed. Tax</th>
                <td mat-cell *matCellDef="let e">{{ e.employeeEducationTax | currency:'JMD':'symbol':'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="paye">
                <th mat-header-cell *matHeaderCellDef>PAYE</th>
                <td mat-cell *matCellDef="let e">{{ e.employeePaye | currency:'JMD':'symbol':'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="loan">
                <th mat-header-cell *matHeaderCellDef>Loan</th>
                <td mat-cell *matCellDef="let e">{{ e.loanDeduction | currency:'JMD':'symbol':'1.2-2' }}</td>
              </ng-container>
              <ng-container matColumnDef="net">
                <th mat-header-cell *matHeaderCellDef>Net Pay</th>
                <td mat-cell *matCellDef="let e"><strong>{{ e.netPay | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
              </ng-container>
              <ng-container matColumnDef="payslip">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let e">
                  <button mat-icon-button matTooltip="View Payslip" (click)="openPayslip(e)">
                    <mat-icon>receipt</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="resultColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: resultColumns;"></tr>
            </table>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button class="gold-btn" (click)="loadRemittance(processedBatch!.id)">
              <mat-icon>receipt_long</mat-icon> View Remittance Report
            </button>
          </mat-card-actions>
        </mat-card>
      </ng-container>
    </mat-tab>

    <!-- ──────────────────────────────────── TAB 3: Remittance ──────────────── -->
    <mat-tab [disabled]="!remittance">
      <ng-template mat-tab-label><mat-icon>receipt_long</mat-icon>&nbsp;Remittance</ng-template>

      <div *ngIf="!remittance" class="empty-state">
        <mat-icon class="empty-icon">summarize</mat-icon>
        <p>Select a processed pay period and click the remittance icon to view report.</p>
      </div>

      <ng-container *ngIf="remittance">
        <mat-card class="remittance-card">
          <mat-card-header>
            <mat-card-title>Consolidated Remittance Report — {{ remittance.label }}</mat-card-title>
            <mat-card-subtitle>{{ remittance.period }} &bull; {{ remittance.employeeCount }} employees</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-boxes">
              <div class="sum-box"><div class="sum-label">Total Gross</div><div class="sum-value">{{ remittance.totalGross | currency:'JMD':'symbol':'1.2-2' }}</div></div>
              <div class="sum-box"><div class="sum-label">Total Net Pay</div><div class="sum-value net">{{ remittance.totalNet | currency:'JMD':'symbol':'1.2-2' }}</div></div>
              <div class="sum-box highlight"><div class="sum-label">Grand Remittance</div><div class="sum-value">{{ remittance.grandTotalRemittance | currency:'JMD':'symbol':'1.2-2' }}</div></div>
            </div>

            <h3 class="section-title">Statutory Breakdown</h3>
            <div class="remittance-table-wrap">
              <table class="remittance-table">
                <thead><tr><th>Statutory Item</th><th>Employee</th><th>Employer</th><th>Total Remittance</th></tr></thead>
                <tbody>
                  <tr>
                    <td>National Insurance Scheme (NIS)</td>
                    <td>{{ remittance.totalEmployeeNis | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td>{{ remittance.totalEmployerNis | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td><strong>{{ remittance.totalNisRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                  <tr>
                    <td>National Housing Trust (NHT)</td>
                    <td>{{ remittance.totalEmployeeNht | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td>{{ remittance.totalEmployerNht | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td><strong>{{ remittance.totalNhtRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                  <tr>
                    <td>Education Tax</td>
                    <td>{{ remittance.totalEmployeeEdTax | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td>{{ remittance.totalEmployerEdTax | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td><strong>{{ remittance.totalEdTaxRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                  <tr>
                    <td>PAYE Income Tax</td>
                    <td>{{ remittance.totalEmployeePaye | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td>—</td>
                    <td><strong>{{ remittance.totalPayeRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                  <tr>
                    <td>HEART Trust/NSTA</td>
                    <td>—</td>
                    <td>{{ remittance.totalEmployerHeart | currency:'JMD':'symbol':'1.2-2' }}</td>
                    <td><strong>{{ remittance.totalHeartRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                  <tr class="total-row">
                    <td><strong>GRAND TOTAL</strong></td>
                    <td><strong>{{ (remittance.totalEmployeeNis + remittance.totalEmployeeNht + remittance.totalEmployeeEdTax + remittance.totalEmployeePaye) | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                    <td><strong>{{ (remittance.totalEmployerNis + remittance.totalEmployerNht + remittance.totalEmployerEdTax + remittance.totalEmployerHeart) | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                    <td><strong>{{ remittance.grandTotalRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="remittance-note">
              <mat-icon>info</mat-icon>
              NIS, NHT, Education Tax and PAYE are remitted to the Tax Administration Jamaica (TAJ). HEART is remitted to the HEART Trust/NSTA.
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button class="gold-btn" (click)="printRemittance()">
              <mat-icon>print</mat-icon> Print Report
            </button>
          </mat-card-actions>
        </mat-card>
      </ng-container>
    </mat-tab>

    <!-- ──────────────────────────────────── TAB 4: Tax Settings ────────────── -->
    <mat-tab>
      <ng-template mat-tab-label><mat-icon>tune</mat-icon>&nbsp;Tax Settings</ng-template>

      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Jamaican Statutory Tax Configuration</mat-card-title>
          <mat-card-subtitle>These rates are used for all payroll calculations. Defaults reflect current JA statutory rates.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="taxConfig">
          <div class="settings-section">
            <h3>Employee Deduction Rates</h3>
            <div class="settings-grid">
              <mat-form-field appearance="outline">
                <mat-label>NIS Rate (Employee) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.nisEmp" step="0.01" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>NHT Rate (Employee) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.nhtEmp" step="0.01" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Education Tax Rate (Employee) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.edEmp" step="0.01" min="0" max="100">
              </mat-form-field>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="settings-section">
            <h3>Employer Contribution Rates</h3>
            <div class="settings-grid">
              <mat-form-field appearance="outline">
                <mat-label>NIS Rate (Employer) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.nisEr" step="0.01" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>NHT Rate (Employer) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.nhtEr" step="0.01" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Education Tax Rate (Employer) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.edEr" step="0.01" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>HEART Trust Rate (Employer) %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.heartEr" step="0.01" min="0" max="100">
              </mat-form-field>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="settings-section">
            <h3>PAYE Income Tax Bands</h3>
            <div class="settings-grid">
              <mat-form-field appearance="outline">
                <mat-label>Lower Band Rate %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.payeLower" step="0.01" min="0" max="100">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Upper Band Rate %</mat-label>
                <input matInput type="number" [(ngModel)]="taxPct.payeUpper" step="0.01" min="0" max="100">
              </mat-form-field>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="settings-section">
            <h3>Thresholds &amp; Ceilings (Annual, J$)</h3>
            <div class="settings-grid">
              <mat-form-field appearance="outline">
                <mat-label>Income Tax Threshold (J$)</mat-label>
                <input matInput type="number" [(ngModel)]="taxConfig.incomeTaxThresholdAnnual" step="1000" min="0">
                <mat-hint>Currently J$1,902,360 per year</mat-hint>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>PAYE Upper Band Threshold (J$)</mat-label>
                <input matInput type="number" [(ngModel)]="taxConfig.payeUpperBandAnnual" step="1000" min="0">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>NIS Annual Ceiling (J$)</mat-label>
                <input matInput type="number" [(ngModel)]="taxConfig.nisAnnualCeiling" step="1000" min="0">
                <mat-hint>Max insurable earnings per year</mat-hint>
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button class="gold-btn" (click)="saveTaxConfig()" [disabled]="savingTax">
            <mat-spinner *ngIf="savingTax" diameter="18"></mat-spinner>
            <mat-icon *ngIf="!savingTax">save</mat-icon>
            {{ savingTax ? 'Saving…' : 'Save Tax Configuration' }}
          </button>
          <button mat-button (click)="resetTaxDefaults()">Reset to JA Defaults</button>
        </mat-card-actions>
      </mat-card>
    </mat-tab>

  </mat-tab-group>
</div>
  `,
  styles: [`
    /* ── Layout ── */
    .payroll-module { padding: 1.5rem; max-width: 1300px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-header h1 { margin: 0; font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem; }
    .page-header .subtitle { color: #666; margin: 0.2rem 0 0; font-size: 0.9rem; }
    .title-icon { vertical-align: middle; color: #C7AE6A; }
    .header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

    /* Tabs */
    ::ng-deep .mat-mdc-tab-group .mat-mdc-tab { min-width: 140px; }
    ::ng-deep .mat-mdc-tab-labels { border-bottom: 2px solid #e0e0e0; }
    ::ng-deep .mat-mdc-tab .mdc-tab__content { display: flex; align-items: center; gap: 4px; }

    /* ── Cards ── */
    .form-card, .list-card, .worksheet-card, .results-card, .settings-card, .remittance-card, .batch-info-card {
      margin: 1rem 0; border-radius: 8px;
    }
    .batch-info-card { background: #f9f7f1; border-left: 4px solid #C7AE6A; margin-bottom: 0.5rem; }

    /* ── Buttons ── */
    .gold-btn { background-color: #C7AE6A !important; color: white !important; }
    .gold-btn:hover { background-color: #b99a45 !important; }
    .gold-btn mat-spinner { display: inline-block; margin-right: 6px; }
    .gold-btn mat-spinner ::ng-deep circle { stroke: white; }
    .run-btn { font-size: 1rem; padding: 0.5rem 1.5rem; }
    .delete-btn { color: #c62828; }

    /* ── Forms ── */
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
    .settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .settings-section { margin: 1.5rem 0; }
    .settings-section h3 { color: #333; margin-bottom: 1rem; font-size: 1rem; }

    /* ── Status chips ── */
    .status-chip { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
    .status-0 { background: #fff3e0; color: #e65100; }   /* Draft - orange */
    .status-1 { background: #e8f5e9; color: #2e7d32; }   /* Processed - green */
    .status-2 { background: #e3f2fd; color: #1565c0; }   /* Paid - blue */

    /* ── Tables ── */
    .full-table { width: 100%; }
    ::ng-deep .mat-mdc-header-cell { font-weight: 600; background: #f5f5f5; }
    ::ng-deep .mat-mdc-row:hover { background: #fffdf5; }

    /* ── Worksheet ── */
    .worksheet-table-wrap { overflow-x: auto; }
    .worksheet-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .worksheet-table th { background: #f5f5f5; padding: 0.6rem 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid #e0e0e0; }
    .worksheet-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; vertical-align: middle; }
    .worksheet-table tr:hover td { background: #fffdf5; }
    .num-col { text-align: right; }
    .ws-input { width: 110px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; text-align: right; font-size: 0.9rem; }
    .ws-input:focus { outline: none; border-color: #C7AE6A; box-shadow: 0 0 0 2px rgba(199,174,106,0.2); }
    .est-net { font-weight: 600; color: #2e7d32; }

    /* ── Results table ── */
    .results-table ::ng-deep .mat-mdc-header-cell { background: #f9f7f1; }
    .results-card ::ng-deep .mat-mdc-card-header { background: #e8f5e9; border-radius: 8px 8px 0 0; padding: 1rem; }
    .results-card ::ng-deep mat-icon { color: #2e7d32; }
    .results-card ::ng-deep mat-card-title { color: #2e7d32; display: flex; align-items: center; gap: 0.5rem; }

    /* ── Remittance ── */
    .summary-boxes { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .sum-box { flex: 1; min-width: 180px; padding: 1.2rem; background: #f5f5f5; border-radius: 8px; text-align: center; }
    .sum-box.highlight { background: #C7AE6A; color: white; }
    .sum-label { font-size: 0.8rem; color: #666; margin-bottom: 0.4rem; }
    .sum-box.highlight .sum-label { color: rgba(255,255,255,0.8); }
    .sum-value { font-size: 1.4rem; font-weight: 700; }
    .sum-value.net { color: #2e7d32; }
    .section-title { margin: 1.5rem 0 0.75rem; color: #333; }
    .remittance-table-wrap { overflow-x: auto; }
    .remittance-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .remittance-table th { background: #f5f5f5; padding: 0.6rem 0.75rem; text-align: right; font-weight: 600; border-bottom: 2px solid #ddd; }
    .remittance-table th:first-child { text-align: left; }
    .remittance-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; text-align: right; }
    .remittance-table td:first-child { text-align: left; }
    .remittance-table .total-row td { background: #f9f7f1; border-top: 2px solid #C7AE6A; }
    .remittance-note { display: flex; align-items: flex-start; gap: 0.5rem; color: #666; font-size: 0.8rem; margin-top: 1rem; background: #f5f5f5; padding: 0.75rem; border-radius: 6px; }
    .remittance-note mat-icon { font-size: 1rem; width: 1rem; height: 1rem; color: #C7AE6A; flex-shrink: 0; }

    /* ── Batch info row ── */
    .batch-info-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .batch-info-row mat-icon { font-size: 1rem; width: 1rem; height: 1rem; vertical-align: middle; margin-right: 4px; color: #C7AE6A; }

    /* ── Misc ── */
    .center-spinner { display: flex; justify-content: center; padding: 3rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; color: #999; text-align: center; }
    .empty-icon { font-size: 3rem; width: 3rem; height: 3rem; margin-bottom: 1rem; color: #ccc; }
    .muted { color: #888; font-size: 0.85rem; }
    .pay-date-label { color: #10b981; font-size: 0.8rem; font-weight: 500; }

    /* ── Payslip overlay ── */
    .payslip-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; }
    .payslip-card { background: white; width: 520px; max-height: 90vh; overflow-y: auto; border-radius: 8px; padding: 2rem; font-family: 'Courier New', monospace; }
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
    .payslip-body { margin: 1rem 0; }
    .payslip-section { margin-bottom: 1rem; }
    .payslip-section h4 { font-size: 0.75rem; letter-spacing: 0.15em; color: #888; border-bottom: 1px dashed #ddd; padding-bottom: 0.3rem; margin-bottom: 0.5rem; }
    .payslip-row { display: flex; justify-content: space-between; padding: 0.2rem 0; font-size: 0.9rem; }
    .gross-row { border-top: 1px solid #ddd; padding-top: 0.4rem; margin-top: 0.2rem; }
    .deductions-row { border-top: 1px solid #ddd; padding-top: 0.4rem; margin-top: 0.2rem; color: #c62828; }
    .payslip-net { display: flex; justify-content: space-between; background: #000; color: white; padding: 0.75rem 0.5rem; border-radius: 4px; font-size: 1.1rem; font-weight: 700; margin: 1rem 0; }
    .net-amount { color: #C7AE6A; }
    .employer-section .payslip-section h4, .employer-section h4 { color: #aaa; }
    .employer-section .payslip-row { color: #777; font-size: 0.82rem; }
    .payslip-footer { text-align: center; font-size: 0.75rem; color: #999; margin: 1rem 0; }
    .payslip-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
    .ytd-table { margin: 0.75rem 0; font-size: 0.72rem; }
    .ytd-label { font-size: 0.7rem; font-weight: 700; color: #888; letter-spacing: 0.06em; margin-bottom: 0.2rem; }
    .ytd-divider { border: none; border-top: 1px solid #ddd; margin: 0 0 0.3rem 0; }
    .ytd-row { display: grid; }
    .ytd-gross-row { grid-template-columns: 1fr; }
    .ytd-ded-row { grid-template-columns: repeat(4, 1fr); }
    .ytd-row span { padding: 0.25rem 0.25rem; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ytd-gross-row span { text-align: left; font-size: 0.82rem; }
    .ytd-header { font-weight: 700; font-size: 0.68rem; color: #888; letter-spacing: 0.04em; }

    /* ── Print ── */
    @media print {
      .no-print { display: none !important; }
      .payroll-module { display: none !important; }
      .payslip-overlay { position: static; background: none; }
      .payslip-card { box-shadow: none; border-radius: 0; max-height: none; padding: 0; }
    }
  `]
})
export class PayrollModuleComponent implements OnInit {

  // ── State ──────────────────────────────────────────────────────────────────
  activeTab = 0;

  // Pay Periods
  batches: PayrollBatchSummary[] = [];
  loadingBatches = false;
  showNewBatchForm = false;
  creating = false;
  newBatch = { label: '', payCycle: 'Monthly', startDate: null as Date | null, endDate: null as Date | null, payDate: null as Date | null };

  // Run Payroll
  activeBatch: PayrollBatchSummary | null = null;
  loadingEmployees = false;
  worksheetEntries: BatchEntryInput[] = [];
  processing = false;
  processedBatch: PayrollBatchDetail | null = null;

  // Remittance
  remittance: RemittanceReport | null = null;

  // Tax settings – percentages (multiply by 100 for display)
  taxConfig: TaxConfig | null = null;
  savingTax = false;
  taxPct = { nisEmp: 3, nhtEmp: 2, edEmp: 2.25, payeLower: 25, payeUpper: 30, nisEr: 3, nhtEr: 3, edEr: 3.5, heartEr: 3 };

  // Payslip
  showPayslip = false;
  payslipLogoError = false;
  payslipEntry: PayrollEntry | null = null;
  payslipBatch: PayrollBatchDetail | null = null;

  // Table columns
  batchColumns = ['label','payCycle','employees','totalNet','totalRemittance','status','actions'];
  resultColumns = ['name','gross','nis','nht','edtax','paye','loan','net','payslip'];

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.loadBatches();
    this.loadTaxConfig();
  }

  // ── Pay Periods ─────────────────────────────────────────────────────────────

  loadBatches() {
    this.loadingBatches = true;
    this.http.get<PayrollBatchSummary[]>(environment.apiUrl + '/payroll-batches').subscribe({
      next: data => { this.batches = data; this.loadingBatches = false; this.cdr.detectChanges(); },
      error: () => { this.loadingBatches = false; this.cdr.detectChanges(); this.snack.open('Failed to load pay periods', 'Close', { duration: 3000 }); }
    });
  }

  openNewBatchForm() {
    this.showNewBatchForm = true;
    if (this.activeTab !== 0) this.activeTab = 0;
  }

  createBatch() {
    if (!this.newBatch.startDate || !this.newBatch.endDate || !this.newBatch.payCycle) {
      this.snack.open('Please fill in all required fields', 'Close', { duration: 3000 }); return;
    }
    this.creating = true;
    this.http.post<{ id: number }>(environment.apiUrl + '/payroll-batches', {
      payCycle: this.newBatch.payCycle,
      startDate: this.newBatch.startDate,
      endDate: this.newBatch.endDate,
      payDate: this.newBatch.payDate,
      label: this.newBatch.label
    }).subscribe({
      next: () => {
        this.creating = false; this.showNewBatchForm = false;
        this.newBatch = { label: '', payCycle: 'Monthly', startDate: null, endDate: null, payDate: null };
        this.cdr.detectChanges();
        this.loadBatches();
        this.snack.open('Pay period created!', '', { duration: 2500 });
      },
      error: (err) => {
        this.creating = false;
        const msg = err.error?.message || 'Failed to create pay period';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  selectBatchForProcessing(batch: PayrollBatchSummary) {
    this.activeBatch = batch;
    this.processedBatch = null;
    this.cdr.detectChanges();
    setTimeout(() => { this.activeTab = 1; });
    this.loadWorksheetEmployees();
  }

  selectBatchForEditing(batch: PayrollBatchSummary) {
    this.activeBatch = batch;
    this.processedBatch = null;
    this.loadingEmployees = true;
    this.cdr.detectChanges();
    setTimeout(() => { this.activeTab = 1; });

    forkJoin({
      detail: this.http.get<PayrollBatchDetail>(`${environment.apiUrl}/payroll-batches/${batch.id}`),
      employees: this.employeeService.getAll()
    }).subscribe({
      next: ({ detail, employees }) => {
        const active = employees.filter(e => e.status !== 'inactive');
        this.worksheetEntries = active.map(emp => {
          const existing = detail.entries.find(e => e.employeeId === emp.id);
          const isHourly = (emp.employmentType || '').toLowerCase() === 'hourly';
          const hours = isHourly && existing && emp.salary > 0
            ? +(existing.baseSalary / emp.salary).toFixed(2)
            : 0;
          return {
            employeeId: emp.id,
            name: this.getEmployeeDisplayName(emp),
            baseSalary: emp.salary,
            employmentType: emp.employmentType || 'Salary',
            hourlyRate: emp.salary,
            hours,
            holidayPay: existing?.holidayPay ?? 0,
            bonus: existing?.bonus ?? 0,
            loanDeduction: existing?.loanDeduction ?? 0
          };
        });
        this.loadingEmployees = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingEmployees = false;
        this.cdr.detectChanges();
        this.snack.open('Failed to load batch for editing', 'Close', { duration: 3000 });
      }
    });
  }

  markPaid(id: number) {
    this.http.post(`${environment.apiUrl}/payroll-batches/${id}/mark-paid`, {}).subscribe({
      next: () => { this.loadBatches(); this.snack.open('Batch marked as paid', '', { duration: 2500 }); },
      error: (e) => this.snack.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
    });
  }

  deleteBatch(id: number) {
    if (!confirm('Delete this pay period? This cannot be undone.')) return;
    this.http.delete(`${environment.apiUrl}/payroll-batches/${id}`).subscribe({
      next: () => { this.loadBatches(); this.snack.open('Deleted', '', { duration: 2000 }); },
      error: (e) => this.snack.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
    });
  }

  loadBatchDetail(id: number, switchTab = false) {
    this.http.get<PayrollBatchDetail>(`${environment.apiUrl}/payroll-batches/${id}`).subscribe({
      next: batch => {
        this.processedBatch = batch;
        this.cdr.detectChanges();
        if (switchTab) setTimeout(() => { this.activeTab = 1; });
      },
      error: () => this.snack.open('Failed to load batch detail', 'Close', { duration: 3000 })
    });
  }

  // ── Run Payroll ─────────────────────────────────────────────────────────────

  loadWorksheetEmployees() {
    this.loadingEmployees = true;
    this.employeeService.getAll().subscribe({
      next: employees => {
        const active = employees.filter(e => e.status !== 'inactive');

        this.worksheetEntries = active.map(e => ({
          employeeId: e.id,
          name: this.getEmployeeDisplayName(e),
          baseSalary: e.salary,
          employmentType: e.employmentType || 'Salary',
          hourlyRate: e.salary,
          hours: 0,
          holidayPay: 0, bonus: 0, loanDeduction: 0
        }));
        this.loadingEmployees = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingEmployees = false; this.cdr.detectChanges(); this.snack.open('Failed to load employees', 'Close', { duration: 3000 }); }
    });
  }

  private normalizePayCycle(payCycle?: string | null): string {
    switch ((payCycle ?? '').trim().toLowerCase()) {
      case 'bi-weekly': case 'biweekly': case 'fortnightly': return 'fortnightly';
      case 'weekly': return 'weekly';
      default: return 'monthly';
    }
  }

  processBatch() {
    if (!this.activeBatch) return;
    this.processing = true;
    const body = {
      entries: this.worksheetEntries.map(e => ({
        employeeId: e.employeeId,
        holidayPay: e.holidayPay || 0,
        bonus: e.bonus || 0,
        loanDeduction: e.loanDeduction || 0,
        ...(e.employmentType === 'Hourly' ? { hours: e.hours || 0 } : {})
      }))
    };
    this.http.post<PayrollBatchDetail>(`${environment.apiUrl}/payroll-batches/${this.activeBatch.id}/process`, body).subscribe({
      next: result => {
        this.processing = false;
        this.processedBatch = result;
        this.activeBatch = null;
        this.cdr.detectChanges();
        this.loadBatches();
        this.snack.open('Payroll processed for ' + result.entries.length + ' employees!', '', { duration: 3000 });
      },
      error: (e) => {
        this.processing = false;
        this.cdr.detectChanges();
        this.snack.open(e.error?.message || 'Processing failed', 'Close', { duration: 4000 });
      }
    });
  }

  // Rough net estimate before official calculation
  estimateNetPay(e: BatchEntryInput): number {
    const base = e.employmentType === 'Hourly' ? (e.hours || 0) * e.hourlyRate : e.baseSalary;
    const gross = base + (e.holidayPay || 0) + (e.bonus || 0);
    const approxDeductions = gross * 0.235; // ~23.5% combined statutory estimate
    return Math.max(0, gross - approxDeductions - (e.loanDeduction || 0));
  }

  recalcEstimate(_e: BatchEntryInput) { /* triggers change detection */ }

  private getEmployeeDisplayName(employee: AppEmployee): string {
    return `${employee.firstName} ${employee.lastName}`.trim() || employee.email || 'Employee';
  }

  // ── Remittance ──────────────────────────────────────────────────────────────

  loadRemittance(id: number) {
    this.http.get<RemittanceReport>(`${environment.apiUrl}/payroll-batches/${id}/remittance`).subscribe({
      next: r => { this.remittance = r; this.cdr.detectChanges(); setTimeout(() => { this.activeTab = 2; }); },
      error: () => this.snack.open('Failed to load remittance report', 'Close', { duration: 3000 })
    });
  }

  printRemittance() { window.print(); }

  // ── Tax Settings ────────────────────────────────────────────────────────────

  loadTaxConfig() {
    this.http.get<TaxConfig>(environment.apiUrl + '/tax-config').subscribe({
      next: cfg => {
        this.taxConfig = cfg;
        this.syncPctFromConfig();
        this.cdr.detectChanges();
      },
      error: () => {
        this.taxConfig = { ...DEFAULT_TAX };
        this.syncPctFromConfig();
        this.cdr.detectChanges();
      }
    });
  }

  syncPctFromConfig() {
    if (!this.taxConfig) return;
    const t = this.taxConfig;
    this.taxPct = {
      nisEmp: t.nisRateEmployee * 100, nhtEmp: t.nhtRateEmployee * 100, edEmp: t.educationTaxRateEmployee * 100,
      payeLower: t.payeRateLower * 100, payeUpper: t.payeRateUpper * 100,
      nisEr: t.nisRateEmployer * 100, nhtEr: t.nhtRateEmployer * 100, edEr: t.educationTaxRateEmployer * 100,
      heartEr: t.heartRateEmployer * 100
    };
  }

  saveTaxConfig() {
    if (!this.taxConfig) return;
    // Convert % back to decimals
    const body: TaxConfig = {
      ...this.taxConfig,
      nisRateEmployee: this.taxPct.nisEmp / 100, nhtRateEmployee: this.taxPct.nhtEmp / 100,
      educationTaxRateEmployee: this.taxPct.edEmp / 100,
      payeRateLower: this.taxPct.payeLower / 100, payeRateUpper: this.taxPct.payeUpper / 100,
      nisRateEmployer: this.taxPct.nisEr / 100, nhtRateEmployer: this.taxPct.nhtEr / 100,
      educationTaxRateEmployer: this.taxPct.edEr / 100, heartRateEmployer: this.taxPct.heartEr / 100
    };
    this.savingTax = true;
    this.http.put<TaxConfig>(environment.apiUrl + '/tax-config', body).subscribe({
      next: saved => {
        this.taxConfig = saved; this.savingTax = false;
        this.snack.open('Tax configuration saved!', '', { duration: 2500 });
      },
      error: () => { this.savingTax = false; this.snack.open('Failed to save tax config', 'Close', { duration: 3000 }); }
    });
  }

  resetTaxDefaults() {
    this.taxConfig = { ...DEFAULT_TAX };
    this.syncPctFromConfig();
    this.snack.open('Reset to Jamaican statutory defaults', '', { duration: 2500 });
  }

  // ── Payslip ─────────────────────────────────────────────────────────────────

  openPayslip(entry: PayrollEntry) {
    this.payslipEntry = entry;
    this.payslipBatch = this.processedBatch;
    this.payslipLogoError = false;
    this.showPayslip = true;
  }

  closePayslip() { this.showPayslip = false; this.payslipEntry = null; }

  printPayslip() { window.print(); }

  getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  onPayDateChange(date: Date | null) {
    if (date && !this.newBatch.label) {
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      this.newBatch.label = `${month} ${year} ${this.newBatch.payCycle}`;
    }
  }

  statusLabel(status: number): string {
    return ['Draft', 'Processed', 'Paid'][status] ?? 'Unknown';
  }

  switchTab(index: number) { this.activeTab = index; }
}
