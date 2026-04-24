import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Employee, LeaveRequest } from '../../types/index';
import { EmployeeService } from '../../services/employee.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employee-records',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="records-container">
      <div class="page-header">
        <button mat-icon-button class="back-btn" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <div class="title-section">
            <h1>Employee Records</h1>
            <p class="subtitle">Detailed employee information and leave management</p>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon">folder</mat-icon>
          <div class="stat-info">
            <h3>{{ employees.length }}</h3>
            <p>Total Records</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon pending">pending_actions</mat-icon>
          <div class="stat-info">
            <h3>{{ getPendingLeaveCount() }}</h3>
            <p>Pending Leave Requests</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon class="stat-icon active">check_circle</mat-icon>
          <div class="stat-info">
            <h3>{{ getActiveEmployeeCount() }}</h3>
            <p>Active Employees</p>
          </div>
        </mat-card>
      </div>

      <!-- Search Bar -->
      <mat-card class="search-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search Employees</mat-label>
          <input
            matInput
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterEmployees()"
            placeholder="Search by name, email, position, department, ID, TRN, or NIS"
          />
          <mat-icon matPrefix>search</mat-icon>
          @if (searchTerm) {
            <button mat-icon-button matSuffix (click)="clearSearch()" aria-label="Clear search">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
        @if (searchTerm && filteredEmployees.length > 0) {
          <div class="search-results-info">
            <mat-icon>info</mat-icon>
            <span>Found {{ filteredEmployees.length }} of {{ employees.length }} employees</span>
          </div>
        }
        @if (searchTerm && filteredEmployees.length === 0) {
          <div class="search-results-info no-results">
            <mat-icon>warning</mat-icon>
            <span>No employees found matching "{{ searchTerm }}"</span>
          </div>
        }
      </mat-card>

      <!-- Employee Records List -->
      <mat-card class="records-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>groups</mat-icon>
            Complete Employee Records
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loading) {
            <div class="loading-state">
              <mat-icon>hourglass_empty</mat-icon>
              <p>Loading employee records...</p>
            </div>
          } @else if (filteredEmployees.length === 0 && !searchTerm) {
            <div class="empty-state">
              <mat-icon>person_off</mat-icon>
              <h3>No employee records found</h3>
              <p>Add employees to see their records here</p>
            </div>
          } @else {
            <mat-accordion>
              @for (employee of filteredEmployees; track employee.id) {
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <div class="employee-header">
                        <div class="employee-avatar">
                          <mat-icon>person</mat-icon>
                        </div>
                        <div class="employee-basic-info">
                          <h3>{{ employee.firstName }} {{ employee.lastName }}</h3>
                          <p>{{ employee.position }} · {{ employee.department }}</p>
                        </div>
                        <mat-chip-set>
                          <mat-chip [class]="'status-' + employee.status">
                            {{ employee.status | titlecase }}
                          </mat-chip>
                        </mat-chip-set>
                      </div>
                    </mat-panel-title>
                  </mat-expansion-panel-header>

                  <div class="employee-details">
                    <!-- Personal Information -->
                    <div class="details-section">
                      <h4><mat-icon>person_outline</mat-icon> Personal Information</h4>
                      <div class="details-grid">
                        <div class="detail-item">
                          <label>Full Name</label>
                          <p>{{ employee.firstName }} {{ employee.lastName }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Email</label>
                          <p>{{ employee.email }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Date of Birth</label>
                          <p>{{ employee.dateOfBirth || 'Not provided' }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Address</label>
                          <p>{{ employee.address || 'Not provided' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Government IDs -->
                    <div class="details-section">
                      <h4><mat-icon>badge</mat-icon> Government & Tax IDs</h4>
                      <div class="details-grid">
                        <div class="detail-item">
                          <label>TRN</label>
                          <p>{{ employee.trn || 'Not provided' }}</p>
                        </div>
                        <div class="detail-item">
                          <label>NIS Number</label>
                          <p>{{ employee.nisNumber || 'Not provided' }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Employee ID</label>
                          <p>{{ employee.employeeIdNumber || 'Not provided' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Employment Details -->
                    <div class="details-section">
                      <h4><mat-icon>work</mat-icon> Employment Information</h4>
                      <div class="details-grid">
                        <div class="detail-item">
                          <label>Position</label>
                          <p>{{ employee.position }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Department</label>
                          <p>{{ employee.department }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Hire Date</label>
                          <p>{{ employee.hireDate }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Employment Type</label>
                          <p>{{ employee.employmentType || 'Salary' }}</p>
                        </div>
                        <div class="detail-item">
                          <label>{{ employee.employmentType === 'Hourly' ? 'Hourly Rate' : 'Gross Salary' }}</label>
                          <p>J$ {{ employee.salary | number:'1.2-2' }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Pay Cycle</label>
                          <p>{{ employee.payCycle || 'Monthly' }}</p>
                        </div>
                        <div class="detail-item">
                          <label>Vacation Days Balance</label>
                          <p>{{ employee.vacationDaysBalance ?? 0 }} days</p>
                        </div>
                        <div class="detail-item">
                          <label>Status</label>
                          <p>{{ employee.status | titlecase }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Banking Information -->
                    <div class="details-section">
                      <h4><mat-icon>account_balance</mat-icon> Banking Information</h4>
                      <div class="details-grid">
                        <div class="detail-item">
                          <label>Bank Account Number</label>
                          <p>{{ employee.bankAccountNumber || 'Not provided' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Leave Requests Section -->
                    <div class="details-section">
                      <h4>
                        <mat-icon>event_available</mat-icon> 
                        Leave Requests 
                        <mat-chip class="leave-count">{{ getEmployeeLeaveRequests(employee.id).length }}</mat-chip>
                      </h4>
                      
                      @if (getEmployeeLeaveRequests(employee.id).length === 0) {
                        <p class="no-records">No leave requests found</p>
                      } @else {
                        <div class="leave-list">
                          @for (leave of getEmployeeLeaveRequests(employee.id); track leave.id) {
                            <mat-card class="leave-card" [class]="'leave-' + leave.status.toLowerCase()">
                              <div class="leave-card-header">
                                <span class="leave-type-chip">
                                  <mat-icon>{{ getLeaveIcon(leave.leaveType) }}</mat-icon>
                                  {{ leave.leaveType }}
                                </span>
                                <mat-chip [class]="'status-chip status-' + leave.status.toLowerCase()">
                                  {{ leave.status }}
                                </mat-chip>
                              </div>
                              <div class="leave-details">
                                <div class="detail-item">
                                  <mat-icon>calendar_today</mat-icon>
                                  <span>{{ leave.startDate | date:'dd MMM yyyy':'UTC' }} → {{ leave.endDate | date:'dd MMM yyyy':'UTC' }}</span>
                                </div>
                                <div class="detail-item">
                                  <mat-icon>timelapse</mat-icon>
                                  <span>{{ leave.daysRequested }} day{{ leave.daysRequested !== 1 ? 's' : '' }}</span>
                                </div>
                                @if (leave.requestedOn) {
                                  <div class="detail-item">
                                    <mat-icon>schedule</mat-icon>
                                    <span>Requested {{ leave.requestedOn | date:'dd MMM yyyy' }}</span>
                                  </div>
                                }
                              </div>
                              @if (leave.reason) {
                                <div class="leave-reason">
                                  <strong>Reason:</strong> {{ leave.reason }}
                                </div>
                              }
                              @if (leave.adminNotes) {
                                <div class="admin-notes">
                                  <strong>Admin Notes:</strong> {{ leave.adminNotes }}
                                </div>
                              }
                              <div class="leave-actions">
                                <div class="view-print-btns">
                                  <button mat-stroked-button (click)="openLeaveView(leave, employee)" matTooltip="View full form">
                                    <mat-icon>visibility</mat-icon> View
                                  </button>
                                  <button mat-stroked-button (click)="openLeaveView(leave, employee); printLeave()" matTooltip="Print leave form">
                                    <mat-icon>print</mat-icon> Print
                                  </button>
                                </div>
                                @if (leave.status === 'Pending') {
                                  <mat-form-field appearance="outline" class="notes-field">
                                    <mat-label>Notes (optional)</mat-label>
                                    <input matInput [(ngModel)]="leave._notes" placeholder="Add a reason or note...">
                                  </mat-form-field>
                                  <div class="action-btns">
                                    <button mat-raised-button color="primary" (click)="approveLeave(leave)">
                                      <mat-icon>check</mat-icon> Approve
                                    </button>
                                    <button mat-stroked-button color="warn" (click)="rejectLeave(leave)">
                                      <mat-icon>close</mat-icon> Reject
                                    </button>
                                  </div>
                                }
                              </div>
                            </mat-card>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </mat-expansion-panel>
              }
            </mat-accordion>
          }
        </mat-card-content>
      </mat-card>
    </div>

    <!-- ── Leave View Overlay (matches leave-requests style) ── -->
    @if (showLeaveDetail && selectedLeave) {
      <div class="leave-overlay" (click)="showLeaveDetail = false">
        <div class="leave-print-card" id="leave-print-area" (click)="$event.stopPropagation()">
          <div class="lp-header">
            <h2>LEAVE REQUEST FORM</h2>
            <p class="lp-company">AccountEezy HR Management</p>
          </div>
          <hr>
          @if (selectedEmployee) {
            <div class="lp-row">
              <span class="lp-label">Employee Name:</span>
              <span class="lp-value">{{ selectedEmployee.firstName }} {{ selectedEmployee.lastName }}</span>
            </div>
            <div class="lp-row">
              <span class="lp-label">Position:</span>
              <span class="lp-value">{{ selectedEmployee.position }}</span>
            </div>
            <div class="lp-row">
              <span class="lp-label">Department:</span>
              <span class="lp-value">{{ selectedEmployee.department }}</span>
            </div>
          }
          <div class="lp-row">
            <span class="lp-label">Leave Type:</span>
            <span class="lp-value">{{ selectedLeave.leaveType }}</span>
          </div>
          <div class="lp-row">
            <span class="lp-label">From:</span>
            <span class="lp-value">{{ selectedLeave.startDate | date:'dd MMMM yyyy':'UTC' }}</span>
          </div>
          <div class="lp-row">
            <span class="lp-label">To:</span>
            <span class="lp-value">{{ selectedLeave.endDate | date:'dd MMMM yyyy':'UTC' }}</span>
          </div>
          <div class="lp-row">
            <span class="lp-label">Days Requested:</span>
            <span class="lp-value">{{ selectedLeave.daysRequested }}</span>
          </div>
          <div class="lp-row">
            <span class="lp-label">Submitted On:</span>
            <span class="lp-value">{{ selectedLeave.requestedOn | date:'dd MMMM yyyy' }}</span>
          </div>
          @if (selectedLeave.reason) {
            <div class="lp-row">
              <span class="lp-label">{{ selectedLeave.leaveType === 'Sick' ? 'Reason' : 'Position / Department' }}:</span>
              <span class="lp-value">{{ selectedLeave.reason }}</span>
            </div>
          }
          <hr>
          <div class="lp-row lp-status-row">
            <span class="lp-label">Status:</span>
            <span class="lp-status" [class]="'lp-status-' + selectedLeave.status.toLowerCase()">{{ selectedLeave.status }}</span>
          </div>
          @if (selectedLeave.adminNotes) {
            <div class="lp-row">
              <span class="lp-label">Admin Notes:</span>
              <span class="lp-value">{{ selectedLeave.adminNotes }}</span>
            </div>
          }
          @if (selectedLeave.leaveType === 'Sick' && selectedLeave.documentPath) {
            <div class="lp-doc-section">
              <p class="lp-doc-label">Medical Certificate / Supporting Document</p>
              @if (isImageDoc(selectedLeave.documentPath)) {
                <img [src]="getDocUrl(selectedLeave.documentPath)" class="lp-doc-img" alt="Medical certificate" />
              } @else {
                <iframe [src]="getSafeDocUrl(selectedLeave.documentPath)" class="lp-doc-iframe" title="Medical certificate"></iframe>
              }
            </div>
          }
          <div class="lp-signatures">
            <div class="lp-sig-block">
              <div class="lp-sig-line"></div>
              <p>Employee Signature &amp; Date</p>
            </div>
            <div class="lp-sig-block">
              <div class="lp-sig-line"></div>
              <p>Authorized Signature &amp; Date</p>
            </div>
          </div>
          <p class="lp-footer">This is a computer-generated leave request. Form No: LR-{{ selectedLeave.id }}</p>
          <div class="lp-actions no-print">
            <button mat-raised-button (click)="printLeave()"><mat-icon>print</mat-icon> Print</button>
            <button mat-button (click)="showLeaveDetail = false">Close</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .records-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .back-btn {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-content {
      flex: 1;
    }

    .title-section h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .subtitle {
      margin: 0;
      color: #6b7280;
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

    .stat-icon.active {
      color: #10b981;
    }

    .stat-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .records-card {
      margin-bottom: 2rem;
    }

    .search-card {
      margin-bottom: 2rem;
      padding: 1.5rem;
    }

    .search-field {
      width: 100%;
      font-size: 1rem;
    }

    .search-field mat-icon[matPrefix] {
      color: #667eea;
      margin-right: 0.5rem;
    }

    .search-results-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #eff6ff;
      border-radius: 8px;
      color: #1e40af;
      font-size: 0.875rem;
      margin-top: 1rem;
    }

    .search-results-info mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .search-results-info.no-results {
      background: #fef2f2;
      color: #991b1b;
    }

    .search-results-info.no-results mat-icon {
      color: #dc2626;
    }

    mat-card-header {
      margin-bottom: 1.5rem;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .employee-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }

    .employee-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .employee-basic-info {
      flex: 1;
    }

    .employee-basic-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .employee-basic-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .status-active {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-on-leave {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-inactive {
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    .employee-details {
      padding: 1.5rem 0;
    }

    .details-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .details-section:last-child {
      border-bottom: none;
    }

    .details-section h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
    }

    .details-section h4 mat-icon {
      color: #667eea;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .detail-item label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .detail-item p {
      margin: 0;
      font-size: 0.95rem;
      color: #1f2937;
    }

    .leave-count {
      margin-left: 0.5rem;
      background: #667eea !important;
      color: white !important;
      font-size: 0.75rem;
      height: 20px !important;
      line-height: 20px !important;
      min-height: 20px !important;
    }

    .no-records {
      color: #9ca3af;
      font-style: italic;
      margin: 1rem 0;
    }

    .leave-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Leave Cards — matches leave-requests page */
    .leave-card {
      padding: 1.5rem;
      border-left: 4px solid #e5e7eb;
      transition: box-shadow 0.2s;
    }

    .leave-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .leave-card.leave-pending  { border-left-color: #f59e0b; }
    .leave-card.leave-approved { border-left-color: #10b981; }
    .leave-card.leave-rejected { border-left-color: #ef4444; }

    .leave-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .leave-type-chip {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
    }

    .leave-type-chip mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      color: #667eea;
    }

    .status-chip {
      font-size: 0.75rem;
      font-weight: 600;
      height: 28px;
    }

    .status-chip.status-pending  { background: #fef3c7 !important; color: #92400e !important; }
    .status-chip.status-approved { background: #d1fae5 !important; color: #065f46 !important; }
    .status-chip.status-rejected { background: #fee2e2 !important; color: #991b1b !important; }

    .leave-details {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .detail-item mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #9ca3af;
    }

    .leave-reason, .admin-notes {
      font-size: 0.875rem;
      color: #6b7280;
      background: #f9fafb;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.75rem;
    }

    .admin-notes {
      background: #eff6ff;
      color: #1e40af;
    }

    .leave-actions {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .view-print-btns {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .view-print-btns button { font-size: 0.8rem; }

    .notes-field {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .action-btns {
      display: flex;
      gap: 0.75rem;
    }

    /* Leave print overlay — matches leave-requests page */
    .leave-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .leave-print-card {
      background: white;
      width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 8px;
      padding: 2rem;
      font-family: 'Times New Roman', Times, serif;
    }

    .lp-header { text-align: center; margin-bottom: 0.5rem; }
    .lp-header h2 { margin: 0 0 0.25rem; font-size: 1.3rem; letter-spacing: 0.15em; font-weight: bold; }
    .lp-company { margin: 0; font-size: 0.9rem; color: #555; }

    .lp-row {
      display: flex;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px dashed #ddd;
      font-size: 0.95rem;
    }

    .lp-label { font-weight: 600; min-width: 160px; flex-shrink: 0; color: #333; }
    .lp-value { color: #111; }
    .lp-status-row { align-items: center; }

    .lp-status {
      font-weight: 700;
      font-size: 1rem;
      padding: 0.2rem 0.75rem;
      border-radius: 4px;
    }

    .lp-status-pending  { background: #fef3c7; color: #92400e; }
    .lp-status-approved { background: #d1fae5; color: #065f46; }
    .lp-status-rejected { background: #fee2e2; color: #991b1b; }

    .lp-signatures {
      display: flex;
      gap: 2rem;
      margin: 2rem 0 1rem;
    }

    .lp-sig-block { flex: 1; text-align: center; }
    .lp-sig-line { border-bottom: 1px solid #333; margin-bottom: 0.4rem; height: 36px; }
    .lp-sig-block p { margin: 0; font-size: 0.8rem; color: #555; }
    .lp-footer { text-align: center; font-size: 0.75rem; color: #999; margin-top: 1rem; }

    .lp-doc-section { margin: 1.25rem 0; }
    .lp-doc-label { font-weight: 600; font-size: 0.9rem; margin: 0 0 0.5rem; color: #333; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
    .lp-doc-img { max-width: 100%; height: auto; border: 1px solid #d1d5db; border-radius: 4px; display: block; }
    .lp-doc-iframe { width: 100%; height: 500px; border: 1px solid #d1d5db; border-radius: 4px; display: block; }

    .lp-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.25rem;
    }

    @media print {
      .no-print { display: none !important; }
      .records-container { display: none !important; }
      .leave-overlay { position: static; background: none; }
      .leave-print-card { box-shadow: none; border-radius: 0; max-height: none; }
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }

    .loading-state mat-icon, .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .records-container {
        padding: 1rem;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeRecordsComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  leaveRequests: LeaveRequest[] = [];
  loading = true;
  searchTerm = '';
  showLeaveDetail = false;
  selectedLeave: LeaveRequest | null = null;
  selectedEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadLeaveRequests();
  }

  loadEmployees() {
    // Set a timeout to ensure we don't load forever
    const timeoutId = setTimeout(() => {
      if (this.loading) {
        console.log('Employee Records: API timeout, loading mock data');
        this.loading = false;
        this.loadMockData();
        this.filteredEmployees = this.employees;
      }
    }, 2000); // 2 second timeout
    
    this.employeeService.getAll().subscribe({
      next: (employees) => {
        clearTimeout(timeoutId);
        this.employees = employees;
        this.filteredEmployees = employees;
        this.loading = false;
      },
      error: (error) => {
        clearTimeout(timeoutId);
        console.error('Employee Records: Error loading employees:', error);
        this.loading = false;
        // Load mock data as fallback
        this.loadMockData();
        this.filteredEmployees = this.employees;
      }
    });
  }

  loadMockData() {
    // Mock employee data for testing
    this.employees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Software Engineer',
        salary: 850000,
        hireDate: '2023-01-15',
        businessId: 1,
        department: 'Engineering',
        status: 'active',
        nisNumber: 'NIS-123456',
        trn: '123-456-789',
        employeeIdNumber: 'EMP-001',
        bankAccountNumber: '1234567890',
        dateOfBirth: '1990-05-15',
        address: '123 Main St, Kingston',
        payCycle: 'Monthly'
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        position: 'Product Manager',
        salary: 950000,
        hireDate: '2022-06-20',
        businessId: 1,
        department: 'Product',
        status: 'active',
        nisNumber: 'NIS-234567',
        trn: '234-567-890',
        employeeIdNumber: 'EMP-002',
        bankAccountNumber: '0987654321',
        dateOfBirth: '1988-08-22',
        address: '456 Oak Ave, Kingston',
        payCycle: 'Bi-Weekly'
      },
      {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.j@example.com',
        position: 'UX Designer',
        salary: 750000,
        hireDate: '2023-03-10',
        businessId: 1,
        department: 'Design',
        status: 'on-leave',
        nisNumber: 'NIS-345678',
        trn: '345-678-901',
        employeeIdNumber: 'EMP-003',
        bankAccountNumber: '1122334455',
        dateOfBirth: '1992-12-10',
        address: '789 Pine Rd, Kingston',
        payCycle: 'Monthly'
      }
    ];
  }

  loadLeaveRequests() {
    const apiUrl = environment.apiUrl + '/leaverequests';
    this.http.get<LeaveRequest[]>(apiUrl).subscribe({
      next: (data) => { this.leaveRequests = data; },
      error: (err)  => { console.error('Failed to load leave requests:', err); }
    });
  }

  filterEmployees() {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = this.employees;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredEmployees = this.employees.filter(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const email = (employee.email || '').toLowerCase();
      const position = (employee.position || '').toLowerCase();
      const department = (employee.department || '').toLowerCase();
      const employeeId = (employee.employeeIdNumber || '').toLowerCase();
      const trn = (employee.trn || '').toLowerCase();
      const nis = (employee.nisNumber || '').toLowerCase();

      return fullName.includes(searchLower) ||
             email.includes(searchLower) ||
             position.includes(searchLower) ||
             department.includes(searchLower) ||
             employeeId.includes(searchLower) ||
             trn.includes(searchLower) ||
             nis.includes(searchLower);
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredEmployees = this.employees;
  }

  goBack() {
    this.router.navigate(['/dashboard/employees']);
  }

  getActiveEmployeeCount(): number {
    return this.employees.filter(e => e.status === 'active').length;
  }

  getPendingLeaveCount(): number {
    return this.leaveRequests.filter(l => l.status === 'Pending').length;
  }

  getEmployeeLeaveRequests(employeeId: number): LeaveRequest[] {
    return this.leaveRequests.filter(l => l.employeeId === employeeId);
  }

  getLeaveIcon(leaveType: string): string {
    switch (leaveType.toLowerCase()) {
      case 'vacation': return 'beach_access';
      case 'sick': return 'local_hospital';
      case 'personal': return 'person';
      default: return 'event';
    }
  }

  approveLeave(leave: LeaveRequest) {
    this.updateLeaveStatus(leave, 'Approved');
  }

  rejectLeave(leave: LeaveRequest) {
    this.updateLeaveStatus(leave, 'Rejected');
  }

  private updateLeaveStatus(leave: LeaveRequest, status: string) {
    const notes = leave._notes || '';
    const apiUrl = environment.apiUrl + '/leaverequests';
    this.http.put(`${apiUrl}/${leave.id}/status`, { status, adminNotes: notes }).subscribe({
      next: () => {
        leave.status = status;
        leave.adminNotes = notes || undefined;
        this.cdr.detectChanges();
        this.snackBar.open(`Leave request ${status.toLowerCase()}`, 'Close', { duration: 2500 });
      },
      error: () => this.snackBar.open('Failed to update leave request', 'Close', { duration: 3000 })
    });
  }

  openLeaveView(leave: LeaveRequest, employee: Employee) {
    this.selectedLeave = leave;
    this.selectedEmployee = employee;
    this.showLeaveDetail = true;
  }

  printLeave() {
    setTimeout(() => {
      const card = document.querySelector<HTMLElement>('.leave-print-card');
      if (!card) return;
      const win = window.open('', '_blank', 'width=700,height=900');
      if (!win) return;
      win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Leave Request Form</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; margin: 2rem; color: #111; }
    .lp-actions { display: none !important; }
    .lp-header { text-align: center; margin-bottom: 0.5rem; }
    .lp-header h2 { margin: 0 0 0.25rem; font-size: 1.3rem; letter-spacing: 0.15em; font-weight: bold; }
    .lp-company { margin: 0; font-size: 0.9rem; color: #555; }
    .lp-row { display: flex; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px dashed #ddd; font-size: 0.95rem; }
    .lp-label { font-weight: 600; min-width: 160px; flex-shrink: 0; color: #333; }
    .lp-value { color: #111; }
    .lp-status { font-weight: 700; font-size: 1rem; padding: 0.2rem 0.75rem; border-radius: 4px; }
    .lp-status-pending  { background: #fef3c7; color: #92400e; }
    .lp-status-approved { background: #d1fae5; color: #065f46; }
    .lp-status-rejected { background: #fee2e2; color: #991b1b; }
    .lp-signatures { display: flex; gap: 2rem; margin: 2rem 0 1rem; }
    .lp-sig-block { flex: 1; text-align: center; }
    .lp-sig-line { border-bottom: 1px solid #333; margin-bottom: 0.4rem; height: 36px; }
    .lp-sig-block p { margin: 0; font-size: 0.8rem; color: #555; }
    .lp-footer { text-align: center; font-size: 0.75rem; color: #999; margin-top: 1rem; }
    .lp-doc-section { margin: 1.25rem 0; page-break-inside: avoid; }
    .lp-doc-label { font-weight: 600; font-size: 0.9rem; margin: 0 0 0.5rem; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }
    .lp-doc-img { max-width: 100%; height: auto; border: 1px solid #ccc; display: block; }
    .lp-doc-iframe { width: 100%; height: 700px; border: 1px solid #ccc; display: block; }
    hr { border: none; border-top: 1px solid #ddd; margin: 0.75rem 0; }
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

  getDocUrl(path: string): string {
    const base = environment.apiUrl.replace(/\/api$/, '');
    return base + path;
  }

  getSafeDocUrl(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getDocUrl(path));
  }

  isImageDoc(path: string): boolean {
    return /\.(jpg|jpeg|png)$/i.test(path);
  }
}
