import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {
  ReportsService,
  MonthlyTaxReport,
  QuarterlyTaxReport,
  YearlyTaxReport,
  So1Report,
  So2Report,
  FinancialSummary
} from '../../services/reports.service';
import { TaxConfigService } from '../../core/services/tax-config.service';
import { TaxConfig } from '../../core/models/dashboard.models';

interface TaxRow { label: string; employee: number; employer: number; total: number; }

@Component({
  selector: 'app-tax-module',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CurrencyPipe,
    MatCardModule, MatButtonModule, MatIconModule, MatTabsModule,
    MatFormFieldModule, MatSelectModule, MatTableModule,
    MatProgressSpinnerModule, MatChipsModule, MatDividerModule
  ],
  template: `
    <div class="tax-module">
      <div class="page-header">
        <div>
          <h1>Tax Reports</h1>
          <p class="subtitle">View statutory remittance breakdowns by period</p>
        </div>
      </div>

      <mat-tab-group animationDuration="200ms" class="report-tabs" (selectedTabChange)="onTabChange($event)">

        <!-- ── MONTHLY TAB ── -->
        <mat-tab label="Monthly">
          <div class="tab-content">
            <div class="controls">
              <mat-form-field appearance="outline">
                <mat-label>Month</mat-label>
                <mat-select [(ngModel)]="selectedMonth">
                  @for (m of months; track m.value) {
                    <mat-option [value]="m.value">{{ m.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Year</mat-label>
                <mat-select [(ngModel)]="selectedYear">
                  @for (y of years; track y) {
                    <mat-option [value]="y">{{ y }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <button mat-raised-button class="generate-btn" (click)="loadMonthly()" [disabled]="loadingMonthly()">
                @if (loadingMonthly()) {
                  <mat-spinner diameter="18"></mat-spinner>
                } @else {
                  <mat-icon>search</mat-icon>
                }
                Generate Report
              </button>
            </div>

            @if (errorMonthly()) {
              <div class="error-banner">⚠️ {{ errorMonthly() }}</div>
            }

            @if (monthlyReport()) {
              <div class="report-section">
                <div class="report-header-row">
                  <h2>{{ monthlyReport()!.monthName }} {{ monthlyReport()!.year }}</h2>
                  <div class="status-actions">
                    <span class="status-badge" [class.paid]="monthlyReport()!.status === 'Paid'">
                      {{ monthlyReport()!.status === 'Paid' ? '✓ Paid' : '⏳ Pending' }}
                    </span>
                    @if (monthlyReport()!.status !== 'Paid' && monthlyReport()!.taxRecordId) {
                      <button mat-stroked-button class="pay-btn" (click)="markPaid(monthlyReport()!.taxRecordId!, 'monthly')">
                        <mat-icon>check_circle</mat-icon> Mark as Paid
                      </button>
                    }
                  </div>
                </div>

                <mat-table [dataSource]="monthlyRows()" class="breakdown-table">
                  <ng-container matColumnDef="component">
                    <mat-header-cell *matHeaderCellDef>Component</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.label }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef><strong>Total Remittance</strong></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="employee">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Employee</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.employee | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col"></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="employer">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Employer</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.employer | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col"></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="total">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Total</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.total | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col total-footer">{{ monthlyReport()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</mat-footer-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="breakdownCols"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: breakdownCols"></mat-row>
                  <mat-footer-row *matFooterRowDef="breakdownCols"></mat-footer-row>
                </mat-table>

                <div class="summary-cards">
                  <div class="summary-card">
                    <span class="card-label">Payroll Remittance</span>
                    <span class="card-value">{{ monthlyReport()!.totalPayrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="summary-card">
                    <span class="card-label">GCT Payable</span>
                    <span class="card-value">{{ monthlyReport()!.gctPayable | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="summary-card highlight">
                    <span class="card-label">Total Due</span>
                    <span class="card-value">{{ monthlyReport()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                </div>

                <!-- ── FINANCIAL SUMMARY ── -->
                <div class="financial-summary">
                  <h3 class="fin-heading">Financial Summary</h3>

                  <div class="fin-grid">
                    <!-- Income -->
                    <div class="fin-section">
                      <h4 class="fin-section-heading income">Income</h4>
                      <table class="fin-table">
                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                        <tbody>
                          @for (item of monthlyReport()!.financial.incomeItems; track item.category) {
                            <tr><td>{{ item.category }}</td><td class="fin-amount">{{ item.totalAmount | currency:'JMD':'symbol':'1.2-2' }}</td></tr>
                          }
                          @if (!monthlyReport()!.financial.incomeItems.length) {
                            <tr><td colspan="2" class="fin-empty">No income recorded</td></tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="fin-total-row">
                            <td>Total Income</td>
                            <td class="fin-amount">{{ monthlyReport()!.financial.totalIncome | currency:'JMD':'symbol':'1.2-2' }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <!-- Expenses -->
                    <div class="fin-section">
                      <h4 class="fin-section-heading expense">Expenses / Bills</h4>
                      <table class="fin-table">
                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                        <tbody>
                          @for (item of monthlyReport()!.financial.expenseItems; track item.category) {
                            <tr><td>{{ item.category }}</td><td class="fin-amount">{{ item.totalAmount | currency:'JMD':'symbol':'1.2-2' }}</td></tr>
                          }
                          @if (!monthlyReport()!.financial.expenseItems.length) {
                            <tr><td colspan="2" class="fin-empty">No expenses recorded</td></tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="fin-total-row">
                            <td>Total Expenses</td>
                            <td class="fin-amount">{{ monthlyReport()!.financial.totalExpenses | currency:'JMD':'symbol':'1.2-2' }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <!-- Salary + Net -->
                  <div class="fin-bottom-row">
                    <div class="fin-stat">
                      <span class="fin-stat-label">Salary Paid</span>
                      <span class="fin-stat-value salary">{{ monthlyReport()!.financial.totalSalaryPaid | currency:'JMD':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="fin-stat net" [class.positive]="monthlyReport()!.financial.netPosition >= 0" [class.negative]="monthlyReport()!.financial.netPosition < 0">
                      <span class="fin-stat-label">Net Position</span>
                      <span class="fin-stat-value">{{ monthlyReport()!.financial.netPosition | currency:'JMD':'symbol':'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- ── QUARTERLY TAB ── -->
        <mat-tab label="Quarterly">
          <div class="tab-content">
            <div class="controls">
              <mat-form-field appearance="outline">
                <mat-label>Quarter</mat-label>
                <mat-select [(ngModel)]="selectedQuarter">
                  <mat-option [value]="1">Q1 (Jan – Mar)</mat-option>
                  <mat-option [value]="2">Q2 (Apr – Jun)</mat-option>
                  <mat-option [value]="3">Q3 (Jul – Sep)</mat-option>
                  <mat-option [value]="4">Q4 (Oct – Dec)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Year</mat-label>
                <mat-select [(ngModel)]="selectedQuarterYear">
                  @for (y of years; track y) {
                    <mat-option [value]="y">{{ y }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <button mat-raised-button class="generate-btn" (click)="loadQuarterly()" [disabled]="loadingQuarterly()">
                @if (loadingQuarterly()) {
                  <mat-spinner diameter="18"></mat-spinner>
                } @else {
                  <mat-icon>search</mat-icon>
                }
                Generate Report
              </button>
            </div>

            @if (errorQuarterly()) {
              <div class="error-banner">⚠️ {{ errorQuarterly() }}</div>
            }

            @if (quarterlyReport()) {
              <div class="report-section">
                <h2>{{ quarterlyReport()!.quarterLabel }} — Breakdown</h2>

                <!-- Month summary cards -->
                <div class="month-cards">
                  @for (m of quarterlyReport()!.months; track m.month) {
                    <mat-card class="month-card">
                      <mat-card-content>
                        <div class="month-card-header">
                          <span class="month-name">{{ m.monthName }}</span>
                          <span class="status-badge small" [class.paid]="m.status === 'Paid'">
                            {{ m.status === 'Paid' ? '✓ Paid' : 'Pending' }}
                          </span>
                        </div>
                        <div class="month-card-amounts">
                          <div><small>Payroll</small><strong>{{ m.totalPayrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></div>
                          <div><small>GCT</small><strong>{{ m.gctPayable | currency:'JMD':'symbol':'1.2-2' }}</strong></div>
                          <div class="total-line"><small>Total</small><strong>{{ m.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></div>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>

                <h3 class="section-subheading">Quarter Totals</h3>
                <mat-table [dataSource]="quarterlyRows()" class="breakdown-table">
                  <ng-container matColumnDef="component">
                    <mat-header-cell *matHeaderCellDef>Component</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.label }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef><strong>Total Remittance</strong></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="employee">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Employee</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.employee | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col"></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="employer">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Employer</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.employer | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col"></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="total">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Total</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.total | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col total-footer">{{ quarterlyReport()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</mat-footer-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="breakdownCols"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: breakdownCols"></mat-row>
                  <mat-footer-row *matFooterRowDef="breakdownCols"></mat-footer-row>
                </mat-table>

                <div class="summary-cards">
                  <div class="summary-card">
                    <span class="card-label">Payroll Remittance</span>
                    <span class="card-value">{{ quarterlyReport()!.totalPayrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="summary-card">
                    <span class="card-label">GCT Payable</span>
                    <span class="card-value">{{ quarterlyReport()!.totalGctPayable | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="summary-card highlight">
                    <span class="card-label">Quarter Total Due</span>
                    <span class="card-value">{{ quarterlyReport()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                </div>

                <!-- ── FINANCIAL SUMMARY ── -->
                <div class="financial-summary">
                  <h3 class="fin-heading">Financial Summary</h3>

                  <div class="fin-grid">
                    <div class="fin-section">
                      <h4 class="fin-section-heading income">Income</h4>
                      <table class="fin-table">
                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                        <tbody>
                          @for (item of quarterlyReport()!.financial.incomeItems; track item.category) {
                            <tr><td>{{ item.category }}</td><td class="fin-amount">{{ item.totalAmount | currency:'JMD':'symbol':'1.2-2' }}</td></tr>
                          }
                          @if (!quarterlyReport()!.financial.incomeItems.length) {
                            <tr><td colspan="2" class="fin-empty">No income recorded</td></tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="fin-total-row">
                            <td>Total Income</td>
                            <td class="fin-amount">{{ quarterlyReport()!.financial.totalIncome | currency:'JMD':'symbol':'1.2-2' }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div class="fin-section">
                      <h4 class="fin-section-heading expense">Expenses / Bills</h4>
                      <table class="fin-table">
                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                        <tbody>
                          @for (item of quarterlyReport()!.financial.expenseItems; track item.category) {
                            <tr><td>{{ item.category }}</td><td class="fin-amount">{{ item.totalAmount | currency:'JMD':'symbol':'1.2-2' }}</td></tr>
                          }
                          @if (!quarterlyReport()!.financial.expenseItems.length) {
                            <tr><td colspan="2" class="fin-empty">No expenses recorded</td></tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="fin-total-row">
                            <td>Total Expenses</td>
                            <td class="fin-amount">{{ quarterlyReport()!.financial.totalExpenses | currency:'JMD':'symbol':'1.2-2' }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div class="fin-bottom-row">
                    <div class="fin-stat">
                      <span class="fin-stat-label">Salary Paid</span>
                      <span class="fin-stat-value salary">{{ quarterlyReport()!.financial.totalSalaryPaid | currency:'JMD':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="fin-stat net" [class.positive]="quarterlyReport()!.financial.netPosition >= 0" [class.negative]="quarterlyReport()!.financial.netPosition < 0">
                      <span class="fin-stat-label">Net Position</span>
                      <span class="fin-stat-value">{{ quarterlyReport()!.financial.netPosition | currency:'JMD':'symbol':'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- ── YEARLY TAB ── -->
        <mat-tab label="Yearly">
          <div class="tab-content">
            <div class="controls">
              <mat-form-field appearance="outline">
                <mat-label>Year</mat-label>
                <mat-select [(ngModel)]="selectedYearlyYear">
                  @for (y of years; track y) {
                    <mat-option [value]="y">{{ y }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <button mat-raised-button class="generate-btn" (click)="loadYearly()" [disabled]="loadingYearly()">
                @if (loadingYearly()) {
                  <mat-spinner diameter="18"></mat-spinner>
                } @else {
                  <mat-icon>search</mat-icon>
                }
                Generate Report
              </button>
            </div>

            @if (errorYearly()) {
              <div class="error-banner">⚠️ {{ errorYearly() }}</div>
            }

            @if (yearlyReport()) {
              <div class="report-section">
                <h2>{{ yearlyReport()!.year }} — Annual Tax Summary</h2>

                <!-- Monthly timeline table -->
                <h3 class="section-subheading">Month-by-Month</h3>
                <div class="timeline-table-wrapper">
                  <table class="timeline-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Payroll Remittance</th>
                        <th>GCT Payable</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (m of yearlyReport()!.months; track m.month) {
                        <tr>
                          <td>{{ m.monthName }}</td>
                          <td>{{ m.totalPayrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</td>
                          <td>{{ m.gctPayable | currency:'JMD':'symbol':'1.2-2' }}</td>
                          <td><strong>{{ m.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                          <td><span class="status-badge small" [class.paid]="m.status === 'Paid'">{{ m.status === 'Paid' ? '✓ Paid' : 'Pending' }}</span></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <h3 class="section-subheading">Annual Component Totals</h3>
                <mat-table [dataSource]="yearlyRows()" class="breakdown-table">
                  <ng-container matColumnDef="component">
                    <mat-header-cell *matHeaderCellDef>Component</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.label }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef><strong>Total Remittance</strong></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="employee">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Employee</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.employee | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col"></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="employer">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Employer</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.employer | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col"></mat-footer-cell>
                  </ng-container>
                  <ng-container matColumnDef="total">
                    <mat-header-cell *matHeaderCellDef class="amount-col">Total</mat-header-cell>
                    <mat-cell *matCellDef="let row" class="amount-col">{{ row.total | currency:'JMD':'symbol':'1.2-2' }}</mat-cell>
                    <mat-footer-cell *matFooterCellDef class="amount-col total-footer">{{ yearlyReport()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</mat-footer-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="breakdownCols"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: breakdownCols"></mat-row>
                  <mat-footer-row *matFooterRowDef="breakdownCols"></mat-footer-row>
                </mat-table>

                <div class="summary-cards">
                  <div class="summary-card">
                    <span class="card-label">Annual Payroll Remittance</span>
                    <span class="card-value">{{ yearlyReport()!.totalPayrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="summary-card">
                    <span class="card-label">Annual GCT Payable</span>
                    <span class="card-value">{{ yearlyReport()!.totalGctPayable | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="summary-card highlight">
                    <span class="card-label">Annual Total Due</span>
                    <span class="card-value">{{ yearlyReport()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                  </div>
                </div>

                <!-- ── FINANCIAL SUMMARY ── -->
                <div class="financial-summary">
                  <h3 class="fin-heading">Financial Summary</h3>

                  <div class="fin-grid">
                    <div class="fin-section">
                      <h4 class="fin-section-heading income">Income</h4>
                      <table class="fin-table">
                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                        <tbody>
                          @for (item of yearlyReport()!.financial.incomeItems; track item.category) {
                            <tr><td>{{ item.category }}</td><td class="fin-amount">{{ item.totalAmount | currency:'JMD':'symbol':'1.2-2' }}</td></tr>
                          }
                          @if (!yearlyReport()!.financial.incomeItems.length) {
                            <tr><td colspan="2" class="fin-empty">No income recorded</td></tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="fin-total-row">
                            <td>Total Income</td>
                            <td class="fin-amount">{{ yearlyReport()!.financial.totalIncome | currency:'JMD':'symbol':'1.2-2' }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div class="fin-section">
                      <h4 class="fin-section-heading expense">Expenses / Bills</h4>
                      <table class="fin-table">
                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                        <tbody>
                          @for (item of yearlyReport()!.financial.expenseItems; track item.category) {
                            <tr><td>{{ item.category }}</td><td class="fin-amount">{{ item.totalAmount | currency:'JMD':'symbol':'1.2-2' }}</td></tr>
                          }
                          @if (!yearlyReport()!.financial.expenseItems.length) {
                            <tr><td colspan="2" class="fin-empty">No expenses recorded</td></tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="fin-total-row">
                            <td>Total Expenses</td>
                            <td class="fin-amount">{{ yearlyReport()!.financial.totalExpenses | currency:'JMD':'symbol':'1.2-2' }}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div class="fin-bottom-row">
                    <div class="fin-stat">
                      <span class="fin-stat-label">Salary Paid</span>
                      <span class="fin-stat-value salary">{{ yearlyReport()!.financial.totalSalaryPaid | currency:'JMD':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="fin-stat net" [class.positive]="yearlyReport()!.financial.netPosition >= 0" [class.negative]="yearlyReport()!.financial.netPosition < 0">
                      <span class="fin-stat-label">Net Position</span>
                      <span class="fin-stat-value">{{ yearlyReport()!.financial.netPosition | currency:'JMD':'symbol':'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- ── SO1 TAB ── -->
        <mat-tab label="SO1 Form">
          <div class="tab-content">
            <div class="controls">
              <mat-form-field appearance="outline">
                <mat-label>Month</mat-label>
                <mat-select [(ngModel)]="so1Month">
                  @for (m of months; track m.value) {
                    <mat-option [value]="m.value">{{ m.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Year</mat-label>
                <mat-select [(ngModel)]="so1Year">
                  @for (y of years; track y) {
                    <mat-option [value]="y">{{ y }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <button mat-raised-button class="generate-btn" (click)="loadSo1()" [disabled]="loadingSo1()">
                @if (loadingSo1()) {
                  <mat-spinner diameter="18"></mat-spinner>
                } @else {
                  <mat-icon>search</mat-icon>
                }
                Generate SO1
              </button>
            </div>

            @if (errorSo1()) {
              <div class="error-banner">⚠️ {{ errorSo1() }}</div>
            }

            @if (so1Report()) {
              <div class="form-preview" id="so1-print">
                <div class="form-govt-header">
                  <div class="form-govt-title">
                    <div class="form-govt-logo">🇯🇲</div>
                    <div>
                      <div class="form-govt-dept">Tax Administration Jamaica</div>
                      <div class="form-govt-subtitle">Statutory Deductions Unit</div>
                    </div>
                  </div>
                  <div class="form-code">
                    <div class="form-code-label">Form</div>
                    <div class="form-code-value">SO1</div>
                    <div class="form-code-sub">Monthly Remittance</div>
                  </div>
                </div>

                <div class="form-title-bar">MONTHLY STATUTORY DEDUCTIONS REMITTANCE</div>

                <div class="form-info-grid">
                  <div class="form-field">
                    <span class="form-field-label">Business / Employer Name</span>
                    <span class="form-field-value">{{ so1Report()!.businessName }}</span>
                  </div>
                  <div class="form-field">
                    <span class="form-field-label">Tax Registration Number (TRN)</span>
                    <span class="form-field-value">{{ so1Report()!.trn }}</span>
                  </div>
                  <div class="form-field">
                    <span class="form-field-label">Period</span>
                    <span class="form-field-value">{{ so1Report()!.monthName }} {{ so1Report()!.year }}</span>
                  </div>
                  <div class="form-field">
                    <span class="form-field-label">Number of Employees</span>
                    <span class="form-field-value">{{ so1Report()!.employeeCount }}</span>
                  </div>
                </div>

                <div class="form-section-heading">PART A — STATUTORY DEDUCTIONS &amp; CONTRIBUTIONS</div>
                <table class="form-table">
                  <thead>
                    <tr>
                      <th class="col-desc">Description</th>
                      <th class="col-rate">Emp Rate</th>
                      <th class="col-amt">Employee (J$)</th>
                      <th class="col-rate">Er Rate</th>
                      <th class="col-amt">Employer (J$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>National Insurance Scheme (NIS)</td>
                      <td class="col-rate">{{ (taxConfig()?.nisRateEmployee ?? 0.03) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.nisEmployee | currency:'JMD':'symbol':'1.2-2' }}</td>
                      <td class="col-rate">{{ (taxConfig()?.nisRateEmployer ?? 0.03) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.nisEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>National Housing Trust (NHT)</td>
                      <td class="col-rate">{{ (taxConfig()?.nhtRateEmployee ?? 0.02) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.nhtEmployee | currency:'JMD':'symbol':'1.2-2' }}</td>
                      <td class="col-rate">{{ (taxConfig()?.nhtRateEmployer ?? 0.03) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.nhtEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Education Tax</td>
                      <td class="col-rate">{{ (taxConfig()?.educationTaxRateEmployee ?? 0.0225) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.educationTaxEmployee | currency:'JMD':'symbol':'1.2-2' }}</td>
                      <td class="col-rate">{{ (taxConfig()?.educationTaxRateEmployer ?? 0.035) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.educationTaxEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Income Tax (PAYE)</td>
                      <td class="col-rate">{{ (taxConfig()?.payeRateLower ?? 0.25) * 100 | number:'1.0-0' }}% / {{ (taxConfig()?.payeRateUpper ?? 0.30) * 100 | number:'1.0-0' }}%</td>
                      <td class="col-amt">{{ so1Report()!.payeEmployee | currency:'JMD':'symbol':'1.2-2' }}</td>
                      <td class="col-rate">—</td>
                      <td class="col-amt">—</td>
                    </tr>
                    <tr>
                      <td>Human Employment &amp; Resource Training (HEART)</td>
                      <td class="col-rate">—</td>
                      <td class="col-amt">—</td>
                      <td class="col-rate">{{ (taxConfig()?.heartRateEmployer ?? 0.03) * 100 | number:'1.0-2' }}%</td>
                      <td class="col-amt">{{ so1Report()!.heartEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr class="subtotal-row">
                      <td colspan="2"><strong>Sub-total</strong></td>
                      <td class="col-amt"><strong>{{ (so1Report()!.nisEmployee + so1Report()!.nhtEmployee + so1Report()!.educationTaxEmployee + so1Report()!.payeEmployee) | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                      <td></td>
                      <td class="col-amt"><strong>{{ (so1Report()!.nisEmployer + so1Report()!.nhtEmployer + so1Report()!.educationTaxEmployer + so1Report()!.heartEmployer) | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div class="form-section-heading">PART B — GENERAL CONSUMPTION TAX (GCT)</div>
                <table class="form-table">
                  <thead>
                    <tr>
                      <th class="col-desc">Description</th>
                      <th colspan="3"></th>
                      <th class="col-amt">Amount (J$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>GCT on Taxable Supplies</td>
                      <td colspan="3"></td>
                      <td class="col-amt"><strong>{{ so1Report()!.gctPayable | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div class="form-total-bar">
                  <span>TOTAL REMITTANCE DUE</span>
                  <span class="form-total-amount">{{ so1Report()!.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</span>
                </div>

                <div class="form-status-row">
                  <span class="status-badge" [class.paid]="so1Report()!.status === 'Paid'">
                    {{ so1Report()!.status === 'Paid' ? '✓ Paid' : '⏳ Pending' }}
                  </span>
                  @if (so1Report()!.status !== 'Paid' && so1Report()!.taxRecordId) {
                    <button mat-stroked-button class="pay-btn" (click)="markSo1Paid(so1Report()!.taxRecordId!)">
                      <mat-icon>check_circle</mat-icon> Mark as Paid
                    </button>
                  }
                </div>

                <div class="form-declaration">
                  I hereby declare that the information given above is true and correct.
                </div>
                <div class="form-sig-row">
                  <div class="form-sig-field"><span>Authorised Signature</span><div class="sig-line"></div></div>
                  <div class="form-sig-field"><span>Date</span><div class="sig-line"></div></div>
                  <div class="form-sig-field"><span>Designation</span><div class="sig-line"></div></div>
                </div>
              </div>

              <div class="print-bar no-print">
                <button mat-raised-button class="print-btn" (click)="printSo1()">
                  <mat-icon>print</mat-icon> Print / Save as PDF
                </button>
              </div>
            }
          </div>
        </mat-tab>

        <!-- ── SO2 TAB ── -->
        <mat-tab label="SO2 Form">
          <div class="tab-content">
            <div class="controls">
              <mat-form-field appearance="outline">
                <mat-label>Year</mat-label>
                <mat-select [(ngModel)]="so2Year">
                  @for (y of years; track y) {
                    <mat-option [value]="y">{{ y }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <button mat-raised-button class="generate-btn" (click)="loadSo2()" [disabled]="loadingSo2()">
                @if (loadingSo2()) {
                  <mat-spinner diameter="18"></mat-spinner>
                } @else {
                  <mat-icon>search</mat-icon>
                }
                Generate SO2
              </button>
            </div>

            @if (errorSo2()) {
              <div class="error-banner">⚠️ {{ errorSo2() }}</div>
            }

            @if (so2Report()) {
              <div class="form-preview" id="so2-print">
                <div class="form-govt-header">
                  <div class="form-govt-title">
                    <div class="form-govt-logo">🇯🇲</div>
                    <div>
                      <div class="form-govt-dept">Tax Administration Jamaica</div>
                      <div class="form-govt-subtitle">Statutory Deductions Unit</div>
                    </div>
                  </div>
                  <div class="form-code">
                    <div class="form-code-label">Form</div>
                    <div class="form-code-value">SO2</div>
                    <div class="form-code-sub">Annual Remittance</div>
                  </div>
                </div>

                <div class="form-title-bar">ANNUAL STATUTORY DEDUCTIONS REMITTANCE</div>

                <div class="form-info-grid">
                  <div class="form-field">
                    <span class="form-field-label">Business / Employer Name</span>
                    <span class="form-field-value">{{ so2Report()!.businessName }}</span>
                  </div>
                  <div class="form-field">
                    <span class="form-field-label">Tax Registration Number (TRN)</span>
                    <span class="form-field-value">{{ so2Report()!.trn }}</span>
                  </div>
                  <div class="form-field">
                    <span class="form-field-label">Tax Year</span>
                    <span class="form-field-value">{{ so2Report()!.year }}</span>
                  </div>
                  <div class="form-field">
                    <span class="form-field-label">Number of Employees</span>
                    <span class="form-field-value">{{ so2Report()!.employeeCount }}</span>
                  </div>
                </div>

                <div class="form-section-heading">PART A — MONTHLY REMITTANCE SUMMARY</div>
                <div class="timeline-table-wrapper">
                  <table class="form-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th class="col-amt">Payroll Remittance (J$)</th>
                        <th class="col-amt">GCT Payable (J$)</th>
                        <th class="col-amt">Total (J$)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (m of so2Report()!.monthlyBreakdown; track m.month) {
                        <tr>
                          <td>{{ m.monthName }}</td>
                          <td class="col-amt">{{ m.payrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</td>
                          <td class="col-amt">{{ m.gctPayable | currency:'JMD':'symbol':'1.2-2' }}</td>
                          <td class="col-amt"><strong>{{ m.totalRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                          <td><span class="status-badge small" [class.paid]="m.status === 'Paid'">{{ m.status === 'Paid' ? '✓ Paid' : 'Pending' }}</span></td>
                        </tr>
                      }
                      <tr class="subtotal-row">
                        <td><strong>TOTALS</strong></td>
                        <td class="col-amt"><strong>{{ so2Report()!.totalPayrollRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                        <td class="col-amt"><strong>{{ so2Report()!.totalGctPayable | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                        <td class="col-amt"><strong>{{ so2Report()!.totalAnnualRemittance | currency:'JMD':'symbol':'1.2-2' }}</strong></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="form-section-heading">PART B — ANNUAL EMPLOYER CONTRIBUTIONS</div>
                <table class="form-table">
                  <thead>
                    <tr>
                      <th class="col-desc">Component</th>
                      <th class="col-amt">Employer (J$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>National Insurance Scheme (NIS)</td>
                      <td class="col-amt">{{ so2Report()!.totalNisEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>National Housing Trust (NHT)</td>
                      <td class="col-amt">{{ so2Report()!.totalNhtEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Education Tax</td>
                      <td class="col-amt">{{ so2Report()!.totalEducationTaxEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Human Employment &amp; Resource Training (HEART)</td>
                      <td class="col-amt">{{ so2Report()!.totalHeartEmployer | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>General Consumption Tax (GCT)</td>
                      <td class="col-amt">{{ so2Report()!.totalGctPayable | currency:'JMD':'symbol':'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="form-total-bar">
                  <span>TOTAL ANNUAL EMPLOYER REMITTANCE</span>
                  <span class="form-total-amount">{{ (so2Report()!.totalNisEmployer + so2Report()!.totalNhtEmployer + so2Report()!.totalEducationTaxEmployer + so2Report()!.totalHeartEmployer + so2Report()!.totalGctPayable) | currency:'JMD':'symbol':'1.2-2' }}</span>
                </div>

                <div class="form-declaration">
                  I hereby declare that the information given above is true and correct.
                </div>
                <div class="form-sig-row">
                  <div class="form-sig-field"><span>Authorised Signature</span><div class="sig-line"></div></div>
                  <div class="form-sig-field"><span>Date</span><div class="sig-line"></div></div>
                  <div class="form-sig-field"><span>Designation</span><div class="sig-line"></div></div>
                </div>
              </div>

              <div class="print-bar no-print">
                <button mat-raised-button class="print-btn" (click)="printSo2()">
                  <mat-icon>print</mat-icon> Print / Save as PDF
                </button>
              </div>
            }
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .tax-module { padding: 2rem; max-width: 1200px; margin: 0 auto; }

    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { color: #000; margin: 0 0 0.25rem; font-size: 1.75rem; }
    .subtitle { color: #666; margin: 0; font-size: 0.9rem; }

    .report-tabs ::ng-deep .mat-mdc-tab-label-container { background: #fff; border-bottom: 2px solid #f0f0f0; }
    .report-tabs ::ng-deep .mdc-tab--active .mdc-tab__text-label { color: #C7AE6A !important; }
    .report-tabs ::ng-deep .mdc-tab-indicator__content--underline { border-color: #C7AE6A !important; }

    .tab-content { padding: 1.5rem 0; }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .controls mat-form-field { width: 180px; }

    .generate-btn {
      background-color: #C7AE6A !important;
      color: white !important;
      height: 56px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .generate-btn mat-spinner { display: inline-flex; }

    .report-section { animation: fadeIn .2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .report-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .report-header-row h2 { margin: 0; font-size: 1.25rem; color: #222; }

    .status-actions { display: flex; align-items: center; gap: 0.75rem; }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffc107;
    }
    .status-badge.paid { background: #d4edda; color: #155724; border-color: #28a745; }
    .status-badge.small { font-size: 0.75rem; padding: 2px 8px; }

    .pay-btn {
      color: #28a745 !important;
      border-color: #28a745 !important;
      font-size: 0.85rem;
    }

    /* Breakdown table */
    .breakdown-table { width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; margin-bottom: 1.5rem; }
    .breakdown-table ::ng-deep .mat-mdc-header-cell { background: #f8f8f5; font-weight: 700; color: #222; }
    .breakdown-table ::ng-deep .mat-mdc-footer-cell { background: #f8f6ee; font-weight: 700; }
    .amount-col { text-align: right !important; justify-content: flex-end; }
    .total-footer { color: #C7AE6A; font-size: 1rem; }

    /* Summary cards */
    .summary-cards { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; }
    .summary-card {
      flex: 1;
      min-width: 180px;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .summary-card.highlight { background: #fdf9ee; border-color: #C7AE6A; }
    .card-label { font-size: 0.8rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .card-value { font-size: 1.15rem; font-weight: 700; color: #222; }
    .summary-card.highlight .card-value { color: #C7AE6A; }

    /* Month cards (quarterly) */
    .month-cards { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .month-card { flex: 1; min-width: 180px; border: 1px solid #e0e0e0; border-radius: 8px; }
    .month-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .month-name { font-weight: 700; font-size: 1rem; }
    .month-card-amounts { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem; }
    .month-card-amounts div { display: flex; justify-content: space-between; }
    .total-line { border-top: 1px solid #eee; padding-top: 0.25rem; margin-top: 0.25rem; }

    .section-subheading { font-size: 1rem; color: #555; margin: 1.5rem 0 0.75rem; font-weight: 600; }

    /* Yearly timeline table */
    .timeline-table-wrapper { overflow-x: auto; margin-bottom: 1.5rem; }
    .timeline-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
    .timeline-table th { background: #f8f8f5; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 0.85rem; color: #333; border-bottom: 2px solid #e0e0e0; }
    .timeline-table td { padding: 9px 14px; font-size: 0.9rem; border-bottom: 1px solid #f0f0f0; }
    .timeline-table tr:last-child td { border-bottom: none; }
    .timeline-table tr:hover td { background: #fdf9ee; }

    .error-banner {
      background: #fff3f3;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    /* ── Official Form Preview ─────────────────────────────────────── */
    .form-preview {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 2rem 2.5rem;
      max-width: 860px;
      margin: 0 auto 1rem;
      font-family: "Times New Roman", serif;
      font-size: 0.92rem;
      color: #000;
    }

    .form-govt-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px double #000;
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .form-govt-title { display: flex; align-items: center; gap: 0.75rem; }
    .form-govt-logo { font-size: 2rem; }
    .form-govt-dept { font-size: 1.1rem; font-weight: bold; }
    .form-govt-subtitle { font-size: 0.8rem; color: #444; }
    .form-code { text-align: right; }
    .form-code-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #555; }
    .form-code-value { font-size: 2.5rem; font-weight: 900; line-height: 1; color: #000; }
    .form-code-sub { font-size: 0.75rem; color: #555; }

    .form-title-bar {
      background: #000;
      color: #fff;
      text-align: center;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 1.25rem;
    }

    .form-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem 1.5rem;
      margin-bottom: 1.25rem;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #999;
      padding-bottom: 0.25rem;
    }
    .form-field-label { font-size: 0.72rem; color: #555; text-transform: uppercase; letter-spacing: 0.4px; }
    .form-field-value { font-size: 1rem; font-weight: bold; }

    .form-section-heading {
      background: #e0e0e0;
      border: 1px solid #999;
      padding: 0.3rem 0.75rem;
      font-size: 0.85rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 1rem 0 0;
    }

    .form-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
      font-size: 0.88rem;
    }
    .form-table th {
      border: 1px solid #999;
      background: #f5f5f5;
      padding: 6px 10px;
      text-align: left;
      font-size: 0.8rem;
    }
    .form-table td {
      border: 1px solid #ccc;
      padding: 6px 10px;
    }
    .form-table tr:nth-child(even) td { background: #fafafa; }
    .col-desc { width: 42%; }
    .col-rate { width: 12%; text-align: center; }
    .col-amt  { text-align: right; }
    .form-table th.col-amt { text-align: right; }
    .subtotal-row td { background: #f0ede0 !important; border-top: 2px solid #999; }

    .form-total-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #000;
      color: #fff;
      padding: 0.6rem 1rem;
      font-size: 1rem;
      font-weight: bold;
      margin-top: 0;
    }
    .form-total-amount { font-size: 1.2rem; color: #C7AE6A; }

    .form-status-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1rem 0 0.5rem;
    }

    .form-declaration {
      border: 1px solid #ccc;
      background: #fafafa;
      padding: 0.5rem 0.75rem;
      font-size: 0.82rem;
      font-style: italic;
      margin-top: 1.5rem;
    }

    .form-sig-row {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .form-sig-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #444;
    }
    .sig-line {
      border-bottom: 1px solid #000;
      height: 2rem;
    }

    .print-bar {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem 0 1rem;
    }
    .print-btn {
      background-color: #444 !important;
      color: #fff !important;
    }

    /* ── Financial Summary ── */
    .financial-summary {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
    }
    .fin-heading {
      margin: 0 0 1.25rem;
      font-size: 1rem;
      font-weight: 700;
      color: #222;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }
    .fin-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 700px) {
      .fin-grid { grid-template-columns: 1fr; }
    }
    .fin-section-heading {
      margin: 0 0 0.6rem;
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .fin-section-heading.income { color: #2e7d32; }
    .fin-section-heading.expense { color: #c62828; }
    .fin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .fin-table th, .fin-table td {
      padding: 0.4rem 0.6rem;
      text-align: left;
      border-bottom: 1px solid #e8e8e8;
    }
    .fin-table thead th {
      background: #eeeeee;
      font-weight: 600;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .fin-table tfoot td {
      font-weight: 700;
      background: #f0f0f0;
      border-top: 2px solid #ccc;
    }
    .fin-amount { text-align: right !important; }
    .fin-empty { color: #999; font-style: italic; text-align: center !important; }
    .fin-bottom-row {
      display: flex;
      gap: 1.5rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    .fin-stat {
      flex: 1;
      min-width: 180px;
      background: #fff;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      border: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .fin-stat.net { border-width: 2px; }
    .fin-stat.net.positive { border-color: #2e7d32; background: #f1f8e9; }
    .fin-stat.net.negative { border-color: #c62828; background: #fff3f3; }
    .fin-stat-label {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #666;
    }
    .fin-stat-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: #222;
    }
    .fin-stat-value.salary { color: #1565c0; }
    .fin-stat.net.positive .fin-stat-value { color: #2e7d32; }
    .fin-stat.net.negative .fin-stat-value { color: #c62828; }

    @media print {
      .no-print { display: none !important; }
      .report-tabs ::ng-deep .mat-mdc-tab-header { display: none !important; }
      .page-header { display: none !important; }
      .controls { display: none !important; }
      .form-preview { border: none; padding: 0; }
    }
  `]
})
export class TaxModuleComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private taxConfigService = inject(TaxConfigService);

  taxConfig = signal<TaxConfig | null>(null);

  // Selectors - Monthly
  selectedMonth = new Date().getMonth() + 1;
  selectedYear  = new Date().getFullYear();

  // Selectors - Quarterly
  selectedQuarter     = Math.ceil((new Date().getMonth() + 1) / 3);
  selectedQuarterYear = new Date().getFullYear();

  // Selectors - Yearly
  selectedYearlyYear = new Date().getFullYear();

  // Selectors - SO1
  so1Month = new Date().getMonth() + 1;
  so1Year  = new Date().getFullYear();

  // Selectors - SO2
  so2Year = new Date().getFullYear();

  // Report data (signals)
  monthlyReport   = signal<MonthlyTaxReport | null>(null);
  quarterlyReport = signal<QuarterlyTaxReport | null>(null);
  yearlyReport    = signal<YearlyTaxReport | null>(null);
  so1Report       = signal<So1Report | null>(null);
  so2Report       = signal<So2Report | null>(null);

  // Loading states
  loadingMonthly   = signal(false);
  loadingQuarterly = signal(false);
  loadingYearly    = signal(false);
  loadingSo1       = signal(false);
  loadingSo2       = signal(false);

  // Error states
  errorMonthly   = signal<string | null>(null);
  errorQuarterly = signal<string | null>(null);
  errorYearly    = signal<string | null>(null);
  errorSo1       = signal<string | null>(null);
  errorSo2       = signal<string | null>(null);

  // Table columns
  breakdownCols = ['component', 'employee', 'employer', 'total'];

  // Options
  months = [
    { value: 1,  label: 'January'   }, { value: 2,  label: 'February'  },
    { value: 3,  label: 'March'     }, { value: 4,  label: 'April'     },
    { value: 5,  label: 'May'       }, { value: 6,  label: 'June'      },
    { value: 7,  label: 'July'      }, { value: 8,  label: 'August'    },
    { value: 9,  label: 'September' }, { value: 10, label: 'October'   },
    { value: 11, label: 'November'  }, { value: 12, label: 'December'  }
  ];

  years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 2 + i);

  // Derived breakdown rows (computed signals)
  monthlyRows = computed<TaxRow[]>(() => {
    const r = this.monthlyReport();
    if (!r) return [];
    return this.buildRows(r);
  });

  quarterlyRows = computed<TaxRow[]>(() => {
    const q = this.quarterlyReport();
    if (!q) return [];
    return [
      { label: 'NIS',            employee: q.totalNisEmployee,           employer: q.totalNisEmployer,           total: q.totalNisEmployee + q.totalNisEmployer },
      { label: 'NHT',            employee: q.totalNhtEmployee,           employer: q.totalNhtEmployer,           total: q.totalNhtEmployee + q.totalNhtEmployer },
      { label: 'Education Tax',  employee: q.totalEducationTaxEmployee,  employer: q.totalEducationTaxEmployer,  total: q.totalEducationTaxEmployee + q.totalEducationTaxEmployer },
      { label: 'PAYE',           employee: q.totalPayeEmployee,          employer: 0,                            total: q.totalPayeEmployee },
      { label: 'HEART',          employee: 0,                            employer: q.totalHeartEmployer,         total: q.totalHeartEmployer },
      { label: 'GCT',            employee: 0,                            employer: q.totalGctPayable,            total: q.totalGctPayable },
    ];
  });

  yearlyRows = computed<TaxRow[]>(() => {
    const y = this.yearlyReport();
    if (!y) return [];
    return [
      { label: 'NIS',            employee: y.totalNisEmployee,           employer: y.totalNisEmployer,           total: y.totalNisEmployee + y.totalNisEmployer },
      { label: 'NHT',            employee: y.totalNhtEmployee,           employer: y.totalNhtEmployer,           total: y.totalNhtEmployee + y.totalNhtEmployer },
      { label: 'Education Tax',  employee: y.totalEducationTaxEmployee,  employer: y.totalEducationTaxEmployer,  total: y.totalEducationTaxEmployee + y.totalEducationTaxEmployer },
      { label: 'PAYE',           employee: y.totalPayeEmployee,          employer: 0,                            total: y.totalPayeEmployee },
      { label: 'HEART',          employee: 0,                            employer: y.totalHeartEmployer,         total: y.totalHeartEmployer },
      { label: 'GCT',            employee: 0,                            employer: y.totalGctPayable,            total: y.totalGctPayable },
    ];
  });

  private buildRows(r: MonthlyTaxReport): TaxRow[] {
    return [
      { label: 'NIS',           employee: r.nisEmployee,          employer: r.nisEmployer,          total: r.nisEmployee + r.nisEmployer },
      { label: 'NHT',           employee: r.nhtEmployee,          employer: r.nhtEmployer,          total: r.nhtEmployee + r.nhtEmployer },
      { label: 'Education Tax', employee: r.educationTaxEmployee, employer: r.educationTaxEmployer, total: r.educationTaxEmployee + r.educationTaxEmployer },
      { label: 'PAYE',          employee: r.payeEmployee,         employer: 0,                      total: r.payeEmployee },
      { label: 'HEART',         employee: 0,                      employer: r.heartEmployer,        total: r.heartEmployer },
      { label: 'GCT',           employee: 0,                      employer: r.gctPayable,           total: r.gctPayable },
    ];
  }

  ngOnInit() {
    this.taxConfigService.get().subscribe({ next: cfg => this.taxConfig.set(cfg) });
    this.loadMonthly();
    this.loadSo1();
    this.loadSo2();
  }

  onTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0: this.loadMonthly(); break;
      case 1: this.loadQuarterly(); break;
      case 2: this.loadYearly(); break;
      case 3: this.loadSo1(); break;
      case 4: this.loadSo2(); break;
    }
  }

  loadMonthly() {
    this.loadingMonthly.set(true);
    this.errorMonthly.set(null);
    this.reportsService.getMonthly(this.selectedMonth, this.selectedYear).subscribe({
      next: data => { this.monthlyReport.set(data); this.loadingMonthly.set(false); },
      error: (err) => {
        this.loadingMonthly.set(false);
        this.errorMonthly.set(err?.error?.message ?? `Error ${err?.status ?? ''}: Could not load report. Is the backend running?`);
        console.error('Monthly report error:', err);
      }
    });
  }

  loadQuarterly() {
    this.loadingQuarterly.set(true);
    this.errorQuarterly.set(null);
    this.reportsService.getQuarterly(this.selectedQuarter, this.selectedQuarterYear).subscribe({
      next: data => { this.quarterlyReport.set(data); this.loadingQuarterly.set(false); },
      error: (err) => {
        this.loadingQuarterly.set(false);
        this.errorQuarterly.set(err?.error?.message ?? `Error ${err?.status ?? ''}: Could not load report. Is the backend running?`);
        console.error('Quarterly report error:', err);
      }
    });
  }

  loadYearly() {
    this.loadingYearly.set(true);
    this.errorYearly.set(null);
    this.reportsService.getYearly(this.selectedYearlyYear).subscribe({
      next: data => { this.yearlyReport.set(data); this.loadingYearly.set(false); },
      error: (err) => {
        this.loadingYearly.set(false);
        this.errorYearly.set(err?.error?.message ?? `Error ${err?.status ?? ''}: Could not load report. Is the backend running?`);
        console.error('Yearly report error:', err);
      }
    });
  }

  markPaid(taxRecordId: number, tab: 'monthly') {
    this.reportsService.markAsPaid(taxRecordId).subscribe({
      next: () => {
        if (tab === 'monthly') {
          const r = this.monthlyReport();
          if (r) this.monthlyReport.set({ ...r, status: 'Paid' });
        }
      }
    });
  }

  loadSo1() {
    this.loadingSo1.set(true);
    this.errorSo1.set(null);
    this.reportsService.getSo1(this.so1Month, this.so1Year).subscribe({
      next: data => { this.so1Report.set(data); this.loadingSo1.set(false); },
      error: (err) => {
        this.loadingSo1.set(false);
        this.errorSo1.set(err?.error?.message ?? `Error ${err?.status ?? ''}: Could not load SO1.`);
        console.error('SO1 error:', err);
      }
    });
  }

  loadSo2() {
    this.loadingSo2.set(true);
    this.errorSo2.set(null);
    this.reportsService.getSo2(this.so2Year).subscribe({
      next: data => { this.so2Report.set(data); this.loadingSo2.set(false); },
      error: (err) => {
        this.loadingSo2.set(false);
        this.errorSo2.set(err?.error?.message ?? `Error ${err?.status ?? ''}: Could not load SO2.`);
        console.error('SO2 error:', err);
      }
    });
  }

  markSo1Paid(taxRecordId: number) {
    this.reportsService.markAsPaid(taxRecordId).subscribe({
      next: () => {
        const r = this.so1Report();
        if (r) this.so1Report.set({ ...r, status: 'Paid' });
      }
    });
  }

  printSo1() {
    window.print();
  }

  printSo2() {
    window.print();
  }
}
