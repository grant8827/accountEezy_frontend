import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayrollResponse } from '../../core/models/payroll.models';
import { PayrollService } from '../../core/services/payroll.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.css'
})
export class PayrollComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly payrollService = inject(PayrollService);

  readonly result = signal<PayrollResponse | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    grossMonthlySalary: [0, [Validators.required, Validators.min(1)]]
  });

  calculate() {
    this.payrollService.calculate(this.form.getRawValue()).subscribe((response) => {
      this.result.set(response);
    });
  }
}
