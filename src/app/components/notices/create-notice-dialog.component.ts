import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-notice-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>add_alert</mat-icon>
          Create New Notice
        </h2>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="noticeForm" class="notice-form">
          <mat-form-field appearance="outline">
            <mat-label>Notice Title</mat-label>
            <input matInput formControlName="title" placeholder="Enter notice title">
            <mat-icon matPrefix>title</mat-icon>
            @if (noticeForm.get('title')?.hasError('required') && noticeForm.get('title')?.touched) {
              <mat-error>Title is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Message</mat-label>
            <textarea
              matInput
              formControlName="message"
              rows="4"
              placeholder="Enter the notice message"></textarea>
            <mat-icon matPrefix>message</mat-icon>
            @if (noticeForm.get('message')?.hasError('required') && noticeForm.get('message')?.touched) {
              <mat-error>Message is required</mat-error>
            }
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Notice Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="info">
                  <mat-icon>info</mat-icon> Information
                </mat-option>
                <mat-option value="warning">
                  <mat-icon>warning</mat-icon> Warning
                </mat-option>
                <mat-option value="error">
                  <mat-icon>error</mat-icon> Error/Alert
                </mat-option>
                <mat-option value="success">
                  <mat-icon>check_circle</mat-icon> Success
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High Priority</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="Tax & Compliance">Tax & Compliance</mat-option>
              <mat-option value="Payroll">Payroll</mat-option>
              <mat-option value="System Updates">System Updates</mat-option>
              <mat-option value="General">General</mat-option>
              <mat-option value="HR">Human Resources</mat-option>
              <mat-option value="Finance">Finance</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onCreate()"
          [disabled]="!noticeForm.valid">
          <mat-icon>add</mat-icon>
          Create Notice
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 550px;
      max-width: 90vw;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0 0 1rem 0;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.5rem;
      color: #1f2937;
    }

    h2 mat-icon {
      color: #667eea;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    mat-dialog-content {
      padding: 1rem 0;
      max-height: 70vh;
      overflow-y: auto;
    }

    .notice-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    textarea {
      min-height: 100px;
    }

    mat-dialog-actions {
      padding: 1rem 0 0 0;
      margin: 0;
    }

    mat-option mat-icon {
      vertical-align: middle;
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreateNoticeDialogComponent {
  noticeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateNoticeDialogComponent>
  ) {
    this.noticeForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      type: ['info', Validators.required],
      priority: ['medium', Validators.required],
      category: ['General', Validators.required]
    });
  }

  onCreate() {
    if (this.noticeForm.valid) {
      this.dialogRef.close(this.noticeForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
