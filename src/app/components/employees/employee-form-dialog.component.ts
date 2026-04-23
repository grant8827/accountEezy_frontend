import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Employee } from '../../types/index';

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>{{ viewOnly ? 'View Employee' : (isEditMode ? 'Edit Employee' : 'Add New Employee') }}</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="employeeForm" class="employee-form">
          <!-- Personal Information Section -->
          <div class="section-header">
            <mat-icon>person</mat-icon>
            <h3>Personal Information</h3>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>First Name</mat-label>
              <mat-icon matPrefix>badge</mat-icon>
              <input matInput formControlName="firstName" placeholder="Enter first name">
              @if (employeeForm.get('firstName')?.hasError('required') && employeeForm.get('firstName')?.touched) {
                <mat-error>First name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Name</mat-label>
              <mat-icon matPrefix>badge</mat-icon>
              <input matInput formControlName="lastName" placeholder="Enter last name">
              @if (employeeForm.get('lastName')?.hasError('required') && employeeForm.get('lastName')?.touched) {
                <mat-error>Last name is required</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date of Birth</mat-label>
              <mat-icon matPrefix>cake</mat-icon>
              <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth" placeholder="MM/DD/YYYY">
              <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
              <mat-datepicker #dobPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email" placeholder="employee@example.com">
              @if (employeeForm.get('email')?.hasError('required') && employeeForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (employeeForm.get('email')?.hasError('email') && employeeForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address</mat-label>
            <mat-icon matPrefix>home</mat-icon>
            <textarea matInput formControlName="address" placeholder="Enter full address" rows="2"></textarea>
          </mat-form-field>

          <!-- Tax & Government IDs Section -->
          <div class="section-header">
            <mat-icon>assignment_ind</mat-icon>
            <h3>Tax & Government IDs</h3>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>TRN (Tax Registration Number)</mat-label>
              <mat-icon matPrefix>receipt_long</mat-icon>
              <input matInput formControlName="trn" placeholder="000-000-000">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>NIS Number</mat-label>
              <mat-icon matPrefix>credit_card</mat-icon>
              <input matInput formControlName="nisNumber" placeholder="NIS-000000">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Employee ID Number</mat-label>
            <mat-icon matPrefix>fingerprint</mat-icon>
            <input matInput formControlName="employeeIdNumber" placeholder="EMP-0001">
          </mat-form-field>

          <!-- Employment Information Section -->
          <div class="section-header">
            <mat-icon>work</mat-icon>
            <h3>Employment Information</h3>
          </div>

          <!-- Employment Type Toggle -->
          <div class="form-row" style="align-items: center; margin-bottom: 8px;">
            <div class="full-width">
              <p style="font-size: 12px; color: rgba(0,0,0,0.6); margin: 0 0 6px 0;">Employment Type</p>
              <mat-button-toggle-group formControlName="employmentType" style="margin-bottom: 12px;">
                <mat-button-toggle value="Salary">
                  <mat-icon style="margin-right: 4px; font-size: 18px; height: 18px; width: 18px;">person</mat-icon>
                  Salary
                </mat-button-toggle>
                <mat-button-toggle value="Hourly">
                  <mat-icon style="margin-right: 4px; font-size: 18px; height: 18px; width: 18px;">schedule</mat-icon>
                  Hourly
                </mat-button-toggle>
              </mat-button-toggle-group>
            </div>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Position</mat-label>
              <mat-icon matPrefix>work_outline</mat-icon>
              <input matInput formControlName="position" placeholder="e.g. Software Engineer">
              @if (employeeForm.get('position')?.hasError('required') && employeeForm.get('position')?.touched) {
                <mat-error>Position is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Department</mat-label>
              <mat-icon matPrefix>business_center</mat-icon>
              <mat-select formControlName="department">
                <mat-option value="Engineering">Engineering</mat-option>
                <mat-option value="Product">Product</mat-option>
                <mat-option value="Design">Design</mat-option>
                <mat-option value="Human Resources">Human Resources</mat-option>
                <mat-option value="Marketing">Marketing</mat-option>
                <mat-option value="Sales">Sales</mat-option>
                <mat-option value="Finance">Finance</mat-option>
                <mat-option value="Operations">Operations</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ employeeForm.get('employmentType')?.value === 'Hourly' ? 'Hourly Rate (J$)' : 'Gross Salary (J$)' }}</mat-label>
              <mat-icon matPrefix>payments</mat-icon>
              <input matInput type="number" formControlName="salary" placeholder="0">
              @if (employeeForm.get('salary')?.hasError('required') && employeeForm.get('salary')?.touched) {
                <mat-error>{{ employeeForm.get('employmentType')?.value === 'Hourly' ? 'Hourly rate' : 'Salary' }} is required</mat-error>
              }
              @if (employeeForm.get('salary')?.hasError('min') && employeeForm.get('salary')?.touched) {
                <mat-error>Value must be greater than 0</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Pay Cycle</mat-label>
              <mat-icon matPrefix>schedule</mat-icon>
              <mat-select formControlName="payCycle">
                <mat-option value="Weekly">Weekly</mat-option>
                <mat-option value="Fortnightly">Bi-Weekly</mat-option>
                <mat-option value="Monthly">Monthly</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Vacation Days Entitled</mat-label>
              <mat-icon matPrefix>beach_access</mat-icon>
              <input matInput type="number" formControlName="vacationDaysBalance" placeholder="0" min="0">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Hire Date</mat-label>
              <mat-icon matPrefix>calendar_today</mat-icon>
              <input matInput [matDatepicker]="picker" formControlName="hireDate" placeholder="MM/DD/YYYY">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              @if (employeeForm.get('hireDate')?.hasError('required') && employeeForm.get('hireDate')?.touched) {
                <mat-error>Hire date is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-icon matPrefix>info</mat-icon>
              <mat-select formControlName="status">
                <mat-option value="active">Active</mat-option>
                <mat-option value="on-leave">On Leave</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Banking Information Section -->
          <div class="section-header">
            <mat-icon>account_balance</mat-icon>
            <h3>Banking Information</h3>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Bank Name</mat-label>
              <mat-icon matPrefix>account_balance</mat-icon>
              <input matInput formControlName="bankName" placeholder="e.g. NCB, Scotiabank">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Bank Account Number</mat-label>
              <mat-icon matPrefix>account_balance_wallet</mat-icon>
              <input matInput formControlName="bankAccountNumber" placeholder="1234567890">
            </mat-form-field>
          </div>

          <!-- Employee Portal Access Section -->
          <div class="section-header">
            <mat-icon>vpn_key</mat-icon>
            <h3>Employee Portal Access</h3>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Portal Password {{ isEditMode ? '(leave blank to keep current)' : '' }}</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input matInput type="password" formControlName="password" placeholder="Enter password for employee login">
            <mat-hint>Employee will use their email and this password to access the employee portal</mat-hint>
            @if (employeeForm.get('password')?.hasError('required') && employeeForm.get('password')?.touched) {
              <mat-error>Password is required for new employees</mat-error>
            }
            @if (employeeForm.get('password')?.hasError('minlength') && employeeForm.get('password')?.touched) {
              <mat-error>Password must be at least 6 characters</mat-error>
            }
          </mat-form-field>

          <!-- YTD Balances Section -->
          <div class="section-header">
            <mat-icon>trending_up</mat-icon>
            <h3>YTD Balances</h3>
          </div>
          <p style="font-size: 12px; color: rgba(0,0,0,0.55); margin: -0.5rem 0 1rem 0;">
            Enter opening balances for employees joining mid-year, or leave at 0 for new hires. These values accumulate with each paid payroll run.
          </p>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>YTD Gross (J$)</mat-label>
              <mat-icon matPrefix>payments</mat-icon>
              <input matInput type="number" formControlName="ytdGross" placeholder="0" min="0">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>YTD NIS (J$)</mat-label>
              <mat-icon matPrefix>account_balance</mat-icon>
              <input matInput type="number" formControlName="ytdNis" placeholder="0" min="0">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>YTD NHT (J$)</mat-label>
              <mat-icon matPrefix>home</mat-icon>
              <input matInput type="number" formControlName="ytdNht" placeholder="0" min="0">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>YTD Education Tax (J$)</mat-label>
              <mat-icon matPrefix>school</mat-icon>
              <input matInput type="number" formControlName="ytdEducationTax" placeholder="0" min="0">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>YTD PAYE (J$)</mat-label>
              <mat-icon matPrefix>receipt</mat-icon>
              <input matInput type="number" formControlName="ytdPaye" placeholder="0" min="0">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>YTD Total Deductions (J$)</mat-label>
              <mat-icon matPrefix>remove_circle_outline</mat-icon>
              <input matInput type="number" formControlName="ytdTotalDeductions" placeholder="0" min="0">
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        @if (viewOnly) {
          <button mat-raised-button mat-dialog-close color="primary">Close</button>
        } @else {
          <button mat-button mat-dialog-close>Cancel</button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="employeeForm.invalid" class="submit-btn">
            <mat-icon>{{ isEditMode ? 'save' : 'person_add' }}</mat-icon>
            {{ isEditMode ? 'Update' : 'Add Employee' }}
          </button>
        }
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 600px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0;
      margin-bottom: 1rem;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    mat-dialog-content {
      padding: 0 1.5rem;
      max-height: 70vh;
      overflow-y: auto;
    }

    .employee-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1.5rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
    }

    .section-header:first-child {
      margin-top: 0;
    }

    .section-header mat-icon {
      color: #667eea;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .section-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .submit-btn {
      background: linear-gradient(135deg, #4F46E5, #3730A3) !important;
      color: white !important;
      font-weight: 600;
    }

    .submit-btn:disabled {
      opacity: 0.5;
    }

    .submit-btn mat-icon {
      margin-right: 0.5rem;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeFormDialogComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode: boolean = false;
  viewOnly: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee, businessId: number, viewOnly?: boolean }
  ) {
    this.isEditMode = !!data.employee;
    this.viewOnly = !!data.viewOnly;

    const passwordValidators = this.isEditMode
      ? [] // Password optional for edit
      : [Validators.required, Validators.minLength(6)]; // Required for new employee

    this.employeeForm = this.fb.group({
      firstName: [data.employee?.firstName || '', Validators.required],
      lastName: [data.employee?.lastName || '', Validators.required],
      email: [data.employee?.email || '', [Validators.required, Validators.email]],
      dateOfBirth: [data.employee?.dateOfBirth ? new Date(data.employee.dateOfBirth) : null],
      address: [data.employee?.address || ''],
      trn: [data.employee?.trn || ''],
      nisNumber: [data.employee?.nisNumber || ''],
      employeeIdNumber: [data.employee?.employeeIdNumber || ''],
      position: [data.employee?.position || '', Validators.required],
      department: [data.employee?.department || 'Engineering'],
      salary: [data.employee?.salary || 0, [Validators.required, Validators.min(1)]],
      payCycle: [data.employee?.payCycle || 'Monthly'],
      employmentType: [data.employee?.employmentType || 'Salary'],
      vacationDaysBalance: [data.employee?.vacationDaysBalance ?? 0],
      hireDate: [data.employee?.hireDate ? new Date(data.employee.hireDate) : new Date(), Validators.required],
      status: [data.employee?.status || 'active'],
      bankName: [data.employee?.bankName || ''],
      bankAccountNumber: [data.employee?.bankAccountNumber || ''],
      password: ['', passwordValidators],
      ytdGross: [data.employee?.ytdGross ?? 0],
      ytdNis: [data.employee?.ytdNis ?? 0],
      ytdNht: [data.employee?.ytdNht ?? 0],
      ytdEducationTax: [data.employee?.ytdEducationTax ?? 0],
      ytdPaye: [data.employee?.ytdPaye ?? 0],
      ytdTotalDeductions: [data.employee?.ytdTotalDeductions ?? 0]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      const employee: Employee = {
        id: this.data.employee?.id || 0,
        firstName: formValue.firstName || '',
        lastName: formValue.lastName || '',
        email: formValue.email || '',
        position: formValue.position || '',
        salary: Number(formValue.salary) || 0,
        hireDate: formValue.hireDate ? formValue.hireDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        businessId: this.data.businessId,
        department: formValue.department || 'General',
        status: formValue.status || 'active',
        nisNumber: formValue.nisNumber || '',
        trn: formValue.trn || undefined,
        employeeIdNumber: formValue.employeeIdNumber || undefined,
        bankName: formValue.bankName || undefined,
        bankAccountNumber: formValue.bankAccountNumber || undefined,
        dateOfBirth: formValue.dateOfBirth ? formValue.dateOfBirth.toISOString().split('T')[0] : undefined,
        address: formValue.address || undefined,
        payCycle: formValue.payCycle || 'Monthly',
        employmentType: formValue.employmentType || 'Salary',
        vacationDaysBalance: Number(formValue.vacationDaysBalance) || 0,
        password: formValue.password || undefined, // Only include if provided
        ytdGross: Number(formValue.ytdGross) || 0,
        ytdNis: Number(formValue.ytdNis) || 0,
        ytdNht: Number(formValue.ytdNht) || 0,
        ytdEducationTax: Number(formValue.ytdEducationTax) || 0,
        ytdPaye: Number(formValue.ytdPaye) || 0,
        ytdTotalDeductions: Number(formValue.ytdTotalDeductions) || 0
      };

      this.dialogRef.close(employee);
    }
  }
}
