import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason?: string;
  status: string;
  adminNotes?: string;
  requestedOn: string;
  employee?: { name: string };
  _notes?: string;
}

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="leaves-container">
      <!-- Header -->
      <div class="page-header">
        <div class="title-section">
          <h1>Leave Requests</h1>
          <p class="subtitle">Review and manage employee leave applications</p>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card pending">
          <mat-icon>pending</mat-icon>
          <div>
            <p class="stat-label">Pending</p>
            <h3>{{ pendingCount }}</h3>
          </div>
        </div>
        <div class="stat-card approved">
          <mat-icon>check_circle</mat-icon>
          <div>
            <p class="stat-label">Approved</p>
            <h3>{{ approvedCount }}</h3>
          </div>
        </div>
        <div class="stat-card rejected">
          <mat-icon>cancel</mat-icon>
          <div>
            <p class="stat-label">Rejected</p>
            <h3>{{ rejectedCount }}</h3>
          </div>
        </div>
        <div class="stat-card total">
          <mat-icon>list_alt</mat-icon>
          <div>
            <p class="stat-label">Total</p>
            <h3>{{ leaveRequests.length }}</h3>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <mat-tab-group (selectedIndexChange)="onFilterChange($event)" class="filter-tabs">
        <mat-tab label="All"></mat-tab>
        <mat-tab label="Pending"></mat-tab>
        <mat-tab label="Approved"></mat-tab>
        <mat-tab label="Rejected"></mat-tab>
      </mat-tab-group>

      <!-- Leave Cards -->
      <div class="leave-list">
        @if (loading) {
          <mat-card class="loading-card">
            <p>Loading leave requests...</p>
          </mat-card>
        } @else if (filteredLeaves.length === 0) {
          <mat-card class="empty-state">
            <mat-icon>event_busy</mat-icon>
            <h3>No leave requests</h3>
            <p>{{ activeFilter === 'All' ? 'No leave requests have been submitted yet.' : 'No ' + activeFilter.toLowerCase() + ' requests.' }}</p>
          </mat-card>
        } @else {
          @for (leave of filteredLeaves; track leave.id) {
            <mat-card class="leave-card" [class]="'leave-' + leave.status.toLowerCase()">
              <div class="leave-card-header">
                <div class="employee-info">
                  <div class="avatar">{{ getInitials(leave.employee?.name || 'E') }}</div>
                  <div>
                    <h3>{{ leave.employee?.name || 'Employee #' + leave.employeeId }}</h3>
                    <span class="leave-type-chip">
                      <mat-icon>{{ getLeaveIcon(leave.leaveType) }}</mat-icon>
                      {{ leave.leaveType }}
                    </span>
                  </div>
                </div>
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
                <div class="detail-item">
                  <mat-icon>schedule</mat-icon>
                  <span>Requested {{ leave.requestedOn | date:'dd MMM yyyy' }}</span>
                </div>
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

              @if (leave.status === 'Pending') {
                <div class="leave-actions">
                  <mat-form-field appearance="outline" class="notes-field">
                    <mat-label>Notes (optional)</mat-label>
                    <input matInput [(ngModel)]="leave['_notes']" placeholder="Add a reason or note...">
                  </mat-form-field>
                  <div class="action-btns">
                    <button mat-raised-button color="primary" (click)="approve(leave)">
                      <mat-icon>check</mat-icon> Approve
                    </button>
                    <button mat-stroked-button color="warn" (click)="reject(leave)">
                      <mat-icon>close</mat-icon> Reject
                    </button>
                  </div>
                </div>
              }
            </mat-card>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .leaves-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .title-section h1 {
      margin: 0 0 0.25rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .subtitle {
      margin: 0;
      color: #6b7280;
    }

    /* Stats */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .stat-card.pending mat-icon { color: #f59e0b; }
    .stat-card.approved mat-icon { color: #10b981; }
    .stat-card.rejected mat-icon { color: #ef4444; }
    .stat-card.total mat-icon { color: #667eea; }

    .stat-label {
      margin: 0 0 0.1rem;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .stat-card h3 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .filter-tabs {
      margin-bottom: 1.5rem;
    }

    /* Leave Cards */
    .leave-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .leave-card {
      padding: 1.5rem;
      border-left: 4px solid #e5e7eb;
      transition: box-shadow 0.2s;
    }

    .leave-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .leave-card.leave-pending { border-left-color: #f59e0b; }
    .leave-card.leave-approved { border-left-color: #10b981; }
    .leave-card.leave-rejected { border-left-color: #ef4444; }

    .leave-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .employee-info h3 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .leave-type-chip {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .leave-type-chip mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .status-chip {
      font-size: 0.75rem;
      font-weight: 600;
      height: 28px;
    }

    .status-chip.status-pending { background: #fef3c7 !important; color: #92400e !important; }
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

    .notes-field {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .action-btns {
      display: flex;
      gap: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .empty-state h3 { margin: 0 0 0.5rem; color: #6b7280; }
    .empty-state p { margin: 0; color: #9ca3af; }

    .loading-card { padding: 2rem; text-align: center; color: #6b7280; }

    @media (max-width: 768px) {
      .leaves-container { padding: 1rem; }
      .stats-row { grid-template-columns: 1fr 1fr; }
      .leave-details { flex-direction: column; gap: 0.5rem; }
    }
  `]
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  filteredLeaves: LeaveRequest[] = [];
  activeFilter = 'All';
  loading = true;
  private readonly apiUrl = environment.apiUrl + '/leaverequests';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loading = true;
    this.http.get<LeaveRequest[]>(this.apiUrl).subscribe({
      next: data => {
        this.leaveRequests = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load leave requests', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFilterChange(index: number) {
    const filters = ['All', 'Pending', 'Approved', 'Rejected'];
    this.activeFilter = filters[index];
    this.applyFilter();
  }

  applyFilter() {
    this.filteredLeaves = this.activeFilter === 'All'
      ? this.leaveRequests
      : this.leaveRequests.filter(l => l.status === this.activeFilter);
  }

  approve(leave: LeaveRequest) {
    this.updateStatus(leave, 'Approved');
  }

  reject(leave: LeaveRequest) {
    this.updateStatus(leave, 'Rejected');
  }

  private updateStatus(leave: LeaveRequest, status: string) {
    const notes = leave._notes || '';
    this.http.put(`${this.apiUrl}/${leave.id}/status`, { status, adminNotes: notes }).subscribe({
      next: () => {
        leave.status = status;
        leave.adminNotes = notes || undefined;
        this.applyFilter();
        this.snackBar.open(`Leave request ${status.toLowerCase()}`, 'Close', { duration: 2500 });
      },
      error: () => this.snackBar.open('Failed to update leave request', 'Close', { duration: 3000 })
    });
  }

  get pendingCount() { return this.leaveRequests.filter(l => l.status === 'Pending').length; }
  get approvedCount() { return this.leaveRequests.filter(l => l.status === 'Approved').length; }
  get rejectedCount() { return this.leaveRequests.filter(l => l.status === 'Rejected').length; }

  getLeaveIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'vacation': return 'beach_access';
      case 'sick': return 'local_hospital';
      case 'personal': return 'person';
      default: return 'event';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
