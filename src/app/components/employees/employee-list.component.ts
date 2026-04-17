import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EmployeeFormDialogComponent } from './employee-form-dialog.component';
import { Employee } from '../../types/index';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatTableModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  template: `
    <div class="employee-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Employee Management</h1>
            <p class="subtitle">Manage your workforce efficiently</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="accent" class="records-btn" (click)="navigateToRecords()">
              <mat-icon>folder_open</mat-icon>
              Employee Records
            </button>
            <button mat-raised-button class="add-btn" (click)="openAddDialog()">
              <mat-icon>person_add</mat-icon>
              Add Employee
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-row">
          <div class="stat-card total">
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">Total Employees</p>
              <h3 class="stat-value">{{ employees.length }}</h3>
            </div>
          </div>
          <div class="stat-card active">
            <div class="stat-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">Active</p>
              <h3 class="stat-value">{{ getActiveCount() }}</h3>
            </div>
          </div>
          <div class="stat-card leave">
            <div class="stat-icon">
              <mat-icon>event_busy</mat-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">On Leave</p>
              <h3 class="stat-value">{{ getOnLeaveCount() }}</h3>
            </div>
          </div>
          <div class="stat-card payroll">
            <div class="stat-icon">
              <mat-icon>payments</mat-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">Monthly Payroll</p>
              <h3 class="stat-value">{{ formatCurrency(getTotalPayroll()) }}</h3>
            </div>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="toolbar">
          <mat-form-field class="search-field" appearance="outline">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search employees..." [(ngModel)]="searchTerm" (ngModelChange)="filterEmployees()">
          </mat-form-field>
          
          <div class="filter-chips">
            <mat-chip-set>
              <mat-chip [class.active-chip]="statusFilter === 'all'" (click)="setStatusFilter('all')">
                All
              </mat-chip>
              <mat-chip [class.active-chip]="statusFilter === 'active'" (click)="setStatusFilter('active')">
                Active
              </mat-chip>
              <mat-chip [class.active-chip]="statusFilter === 'on-leave'" (click)="setStatusFilter('on-leave')">
                On Leave
              </mat-chip>
              <mat-chip [class.active-chip]="statusFilter === 'inactive'" (click)="setStatusFilter('inactive')">
                Inactive
              </mat-chip>
            </mat-chip-set>
          </div>
        </div>
      </div>

      <!-- Employee Table List -->
      <div class="employee-list-wrapper">
        @if (loading) {
          <div class="loading-state">
            <mat-icon>hourglass_empty</mat-icon>
            <p>Loading employees...</p>
          </div>
        } @else if (filteredEmployees.length > 0) {
          <table mat-table [dataSource]="filteredEmployees" class="employee-table">
            
            <!-- Employee Column -->
            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let employee">
                <div class="employee-info">
                  <div class="employee-avatar">
                    {{ getInitials(employee) }}
                  </div>
                  <div class="name-section">
                    <div class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</div>
                    <div class="employee-position">{{ employee.position }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let employee">
                <div class="detail-row">
                  <mat-icon>email</mat-icon>
                  <span>{{ employee.email }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Department Column -->
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let employee">
                <div class="detail-row">
                  <mat-icon>business_center</mat-icon>
                  <span>{{ employee.department || 'General' }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Hire Date Column -->
            <ng-container matColumnDef="hireDate">
              <th mat-header-cell *matHeaderCellDef>Hire Date</th>
              <td mat-cell *matCellDef="let employee">
                <div class="detail-row">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{ formatDate(employee.hireDate) }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Salary Column -->
            <ng-container matColumnDef="salary">
              <th mat-header-cell *matHeaderCellDef>Salary</th>
              <td mat-cell *matCellDef="let employee">
                <div class="salary-amount">{{ formatCurrency(employee.salary) }}/mo</div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let employee">
                <mat-chip [class]="'status-chip status-' + (employee.status || 'active')">
                  {{ (employee.status || 'active') | titlecase }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let employee">
                <div class="table-actions">
                  <button mat-icon-button matTooltip="View" (click)="viewEmployee(employee)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Edit" (click)="editEmployee(employee)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Delete" (click)="deleteEmployee(employee)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="employee-row"></tr>
          </table>
        } @else {
          <div class="empty-state">
            <mat-icon>people_outline</mat-icon>
            <h3>No employees found</h3>
            <p>{{ searchTerm ? 'Try adjusting your search' : (loadError ?? 'Get started by adding your first employee') }}</p>
            <button mat-raised-button class="add-btn" (click)="openAddDialog()">
              <mat-icon>person_add</mat-icon>
              Add Employee
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .employee-container {
      min-height: 100vh;
      background: #f8fafc;
      padding: 2rem;
    }

    .page-header {
      max-width: 1400px;
      margin: 0 auto 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .title-section h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .add-btn {
      background: linear-gradient(135deg, #4F46E5, #3730A3) !important;
      color: white !important;
      border-radius: 10px;
      padding: 0.75rem 1.5rem !important;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(79,70,229,0.3);
      transition: all 0.2s;
    }

    .add-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79,70,229,0.4);
    }

    .add-btn mat-icon {
      margin-right: 0.5rem;
    }

    .records-btn {
      border-radius: 10px;
      padding: 0.75rem 1.5rem !important;
      font-weight: 600;
      transition: all 0.2s;
    }

    .records-btn:hover {
      transform: translateY(-2px);
    }

    .records-btn mat-icon {
      margin-right: 0.5rem;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .stat-card.total {
      border-color: #4F46E5;
    }

    .stat-card.active {
      border-color: #10b981;
    }

    .stat-card.leave {
      border-color: #f59e0b;
    }

    .stat-card.payroll {
      border-color: #3b82f6;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card.total .stat-icon {
      background: linear-gradient(135deg, #4F46E5, #3730A3);
    }

    .stat-card.active .stat-icon {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-card.leave .stat-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .stat-card.payroll .stat-icon {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .stat-icon mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
      background: white;
      border-radius: 10px;
    }

    .filter-chips {
      display: flex;
      align-items: center;
    }

    .filter-chips mat-chip {
      cursor: pointer;
      background: white !important;
      color: #6b7280 !important;
      border: 1px solid #e5e7eb !important;
      transition: all 0.2s;
    }

    .filter-chips mat-chip:hover {
      border-color: #4F46E5 !important;
      color: #4F46E5 !important;
    }

    .filter-chips mat-chip.active-chip {
      background: linear-gradient(135deg, #4F46E5, #3730A3) !important;
      color: white !important;
      border-color: transparent !important;
    }

    /* Employee Table List */
    .employee-list-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .employee-table {
      width: 100%;
      background: white;
    }

    .employee-table th {
      background: #f8fafc;
      color: #1f2937;
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 1.25rem 1.5rem !important;
      border-bottom: 2px solid #e5e7eb;
    }

    .employee-table td {
      padding: 1.25rem 1.5rem !important;
      border-bottom: 1px solid #f3f4f6;
    }

    .employee-row {
      transition: all 0.2s ease;
    }

    .employee-row:hover {
      background: #f8fafc;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .employee-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4F46E5, #3730A3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .name-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .employee-name {
      font-size: 1rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .employee-position {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .detail-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9ca3af;
    }

    .salary-amount {
      font-weight: 700;
      color: #1f2937;
      font-size: 0.95rem;
    }

    .status-chip {
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      padding: 0.25rem 0.75rem !important;
      height: auto !important;
    }

    .status-chip.status-active {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-chip.status-on-leave {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-chip.status-inactive {
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    .table-actions {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-end;
    }

    .table-actions button {
      color: #6b7280;
      transition: all 0.2s;
    }

    .table-actions button:hover {
      color: #4F46E5;
      background: #ede9fe;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
    }

    .loading-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4F46E5;
      margin-bottom: 1rem;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      color: #6b7280;
      font-size: 1.1rem;
      margin: 0;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      border: 2px dashed #e5e7eb;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .employee-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .stats-row {
        grid-template-columns: 1fr;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        width: 100%;
        min-width: auto;
      }

      .employee-table {
        font-size: 0.875rem;
      }

      .employee-table th,
      .employee-table td {
        padding: 1rem 0.75rem !important;
      }

      .detail-row span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 150px;
      }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  displayedColumns: string[] = ['employee', 'email', 'department', 'hireDate', 'salary', 'status', 'actions'];
  loading: boolean = false;
  loadError: string | null = null;

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.loadError = null;
    this.employeeService.getAll().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.employees = [];
        this.filteredEmployees = [];
        this.cdr.detectChanges();
        let msg = 'Failed to load employees.';
        if (error.status === 401) msg = 'Session expired. Please log in again.';
        else if (error.status === 0) msg = 'Cannot connect to server. Check backend is running.';
        this.loadError = msg;
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { businessId: 1 },
      panelClass: 'employee-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.create(result).subscribe({
          next: (newEmployee) => {
            this.employees = [...this.employees, newEmployee];
            this.filterEmployees();
            this.snackBar.open('Employee added successfully!', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error adding employee:', error);
            this.snackBar.open('Failed to add employee', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  navigateToRecords() {
    this.router.navigate(['/dashboard/employee-records']);
  }

  getActiveCount(): number {
    return this.employees.filter(e => e.status === 'active').length;
  }

  getOnLeaveCount(): number {
    return this.employees.filter(e => e.status === 'on-leave').length;
  }

  getTotalPayroll(): number {
    return this.employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  }

  filterEmployees() {
    let filtered = this.employees;

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.position.toLowerCase().includes(term) ||
        (e.department && e.department.toLowerCase().includes(term))
      );
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === this.statusFilter);
    }

    this.filteredEmployees = filtered;
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.filterEmployees();
  }

  getInitials(employee: Employee): string {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  }

  viewEmployee(employee: Employee) {
    this.dialog.open(EmployeeFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { employee, businessId: 1, viewOnly: true },
      panelClass: 'employee-dialog'
    });
  }

  editEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { employee, businessId: 1 },
      panelClass: 'employee-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Component: Editing employee:', employee.id, result);
        this.employeeService.update(employee.id, result).subscribe({
          next: (updatedEmployee) => {
            console.log('Component: Employee updated successfully:', updatedEmployee);
            const index = this.employees.findIndex(e => e.id === employee.id);
            if (index !== -1) {
              this.employees[index] = updatedEmployee;
              this.employees = [...this.employees];
              this.filterEmployees();
            }
            this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Component: Error updating employee:', error);
            console.error('Component: Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error
            });
            const errorMsg = error.status === 404 ? 'Employee not found' : 
                           error.status === 401 ? 'Unauthorized - please login again' :
                           error.status === 400 ? 'Invalid employee data' :
                           'Failed to update employee';
            this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  deleteEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.employeeService.delete(employee.id).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== employee.id);
          this.filterEmployees();
          this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.snackBar.open('Failed to delete employee', 'Close', { duration: 3000 });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatCurrency(amount: number): string {
    return `J$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }
}
