import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../../environments/environment';

interface ProfileData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName: string;
  trn: string;
  sector: string;
  registrationNumber?: string;
  nis?: string;
  businessType?: string;
  fiscalYearEnd?: string;
  street?: string;
  city?: string;
  parish?: string;
  postalCode?: string;
  country: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  logoUrl?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="profile-container">
      <div class="page-header">
        <h1>My Profile</h1>
        <p class="subtitle">View and update your business registration information</p>
      </div>

      @if (loading) {
        <div class="loading-state">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Loading profile...</p>
        </div>
      }

      @if (!loading && profile) {
        <!-- Business Info Section -->
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-title>Business Information</mat-card-title>
            <mat-card-subtitle>Registration details for your company</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid">
              <div class="field-group">
                <label>First Name</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.firstName" placeholder="First name">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Last Name</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.lastName" placeholder="Last name">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Email</label>
                <mat-form-field appearance="outline">
                  <input matInput [value]="profile.email" disabled>
                  <mat-icon matSuffix>lock</mat-icon>
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Personal Phone</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.phone" placeholder="Phone number">
                </mat-form-field>
              </div>
              <div class="field-group full-width">
                <label>Company Name</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.companyName" placeholder="Company name">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>TRN</label>
                <mat-form-field appearance="outline">
                  <input matInput [value]="profile.trn" disabled>
                  <mat-icon matSuffix>lock</mat-icon>
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>NIS</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.nis" placeholder="NIS number">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Industry / Sector</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.sector" placeholder="Industry or sector">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Business Type</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.businessType" placeholder="Business type">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Registration Number</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.registrationNumber" placeholder="Registration number">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Fiscal Year End</label>
                <mat-form-field appearance="outline">
                  <input matInput type="date" [(ngModel)]="profile.fiscalYearEnd">
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>
            <h3 class="section-sub-title">Address</h3>
            <div class="form-grid">
              <div class="field-group full-width">
                <label>Street</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.street" placeholder="Street address">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>City</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.city" placeholder="City">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Parish</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.parish" placeholder="Parish">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Postal Code</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.postalCode" placeholder="Postal code">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Country</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.country" placeholder="Country">
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>
            <h3 class="section-sub-title">Business Contact</h3>
            <div class="form-grid">
              <div class="field-group">
                <label>Business Phone</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.businessPhone" placeholder="Business phone">
                </mat-form-field>
              </div>
              <div class="field-group">
                <label>Business Email</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.businessEmail" placeholder="Business email">
                </mat-form-field>
              </div>
              <div class="field-group full-width">
                <label>Website</label>
                <mat-form-field appearance="outline">
                  <input matInput [(ngModel)]="profile.website" placeholder="https://...">
                </mat-form-field>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="saveProfile()" [disabled]="saving">
              <mat-icon>save</mat-icon>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Business Logo Section -->
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>image</mat-icon>
            <mat-card-title>Business Logo</mat-card-title>
            <mat-card-subtitle>Shown on payslips and reports</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="logo-section">
              <div class="logo-current">
                @if (profile.logoUrl) {
                  <img [src]="profile.logoUrl" alt="Business logo" class="logo-current-img">
                } @else {
                  <div class="logo-placeholder-box">
                    <mat-icon>business</mat-icon>
                    <span>No logo</span>
                  </div>
                }
              </div>
              <div class="logo-upload-controls">
                <button mat-stroked-button type="button" (click)="profileLogoInput.click()">
                  <mat-icon>upload</mat-icon> {{ profile.logoUrl ? 'Replace Logo' : 'Upload Logo' }}
                </button>
                <p class="logo-hint">JPEG, PNG or WebP · Max 2 MB</p>
                @if (logoFile) {
                  <p class="logo-filename">{{ logoFile.name }}</p>
                }
                @if (logoPreviewUrl) {
                  <img [src]="logoPreviewUrl" alt="Preview" class="logo-preview-new">
                }
                <input #profileLogoInput type="file" accept="image/jpeg,image/png,image/webp" style="display:none" (change)="onLogoSelected($event)">
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="uploadLogo()" [disabled]="uploadingLogo || !logoFile">
              <mat-icon>save</mat-icon>
              {{ uploadingLogo ? 'Uploading...' : 'Save Logo' }}
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Change Password Section -->
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>lock</mat-icon>
            <mat-card-title>Change Password</mat-card-title>
            <mat-card-subtitle>Update your account password</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid narrow">
              <div class="field-group full-width">
                <label>Current Password</label>
                <mat-form-field appearance="outline">
                  <input matInput type="password" [(ngModel)]="currentPassword" placeholder="Current password">
                </mat-form-field>
              </div>
              <div class="field-group full-width">
                <label>New Password</label>
                <mat-form-field appearance="outline">
                  <input matInput type="password" [(ngModel)]="newPassword" placeholder="New password">
                </mat-form-field>
              </div>
              <div class="field-group full-width">
                <label>Confirm New Password</label>
                <mat-form-field appearance="outline">
                  <input matInput type="password" [(ngModel)]="confirmPassword" placeholder="Confirm new password">
                </mat-form-field>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="warn"
              (click)="changePassword()"
              [disabled]="changingPassword || !currentPassword || !newPassword || !confirmPassword">
              <mat-icon>lock_reset</mat-icon>
              {{ changingPassword ? 'Updating...' : 'Change Password' }}
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary-brand);
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      color: #999;
      gap: 1rem;
    }

    .loading-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .profile-card {
      margin-bottom: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    mat-card-header {
      padding: 1.5rem 1.5rem 0;
    }

    mat-card-content {
      padding: 1.5rem;
    }

    mat-card-actions {
      padding: 0.5rem 1.5rem 1.5rem;
    }

    .section-sub-title {
      font-size: 1rem;
      font-weight: 600;
      color: #555;
      margin: 1.5rem 0 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1.5rem;
    }

    .form-grid.narrow {
      grid-template-columns: 1fr;
      max-width: 400px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.25rem;
    }

    .field-group.full-width {
      grid-column: 1 / -1;
    }

    .field-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .field-group mat-form-field {
      width: 100%;
    }

    mat-divider {
      margin: 1.5rem 0 0;
    }

    @media (max-width: 600px) {
      .profile-container {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .field-group.full-width {
        grid-column: 1;
      }
    }

    .logo-section {
      display: flex;
      align-items: flex-start;
      gap: 2rem;
    }

    .logo-current-img {
      width: 100px;
      height: 100px;
      object-fit: contain;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
      padding: 4px;
      flex-shrink: 0;
    }

    .logo-placeholder-box {
      width: 100px;
      height: 100px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      color: #aaa;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .logo-placeholder-box mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .logo-placeholder-box span {
      font-size: 0.7rem;
    }

    .logo-upload-controls {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .logo-hint {
      margin: 0;
      font-size: 0.75rem;
      color: #888;
    }

    .logo-filename {
      margin: 0;
      font-size: 0.8rem;
      color: var(--primary-color, #1565c0);
      font-weight: 500;
    }

    .logo-preview-new {
      width: 80px;
      height: 80px;
      object-fit: contain;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
      padding: 4px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: ProfileData | null = null;
  loading = true;
  saving = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  changingPassword = false;

  // Logo upload state
  logoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  uploadingLogo = false;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.http.get<ProfileData>(`${this.apiUrl}/auth/profile`)
      .subscribe({
        next: (data) => {
          if (data.fiscalYearEnd) {
            data.fiscalYearEnd = data.fiscalYearEnd.substring(0, 10);
          }
          this.profile = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.snackBar.open('Failed to load profile', 'Close', { duration: 4000 });
        }
      });
  }

  saveProfile() {
    if (!this.profile) return;
    this.saving = true;
    const payload = { ...this.profile, fiscalYearEnd: this.profile.fiscalYearEnd || null };
    this.http.put<ProfileData>(`${this.apiUrl}/auth/profile`, payload)
      .subscribe({
        next: (data) => {
          if (data.fiscalYearEnd) {
            data.fiscalYearEnd = data.fiscalYearEnd.substring(0, 10);
          }
          this.profile = data;
          this.saving = false;
          this.cdr.detectChanges();
          this.snackBar.open('Profile saved successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.snackBar.open('Failed to save profile', 'Close', { duration: 4000 });
        }
      });
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('New passwords do not match', 'Close', { duration: 4000 });
      return;
    }
    this.changingPassword = true;
    this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/auth/change-password`,
      { currentPassword: this.currentPassword, newPassword: this.newPassword }
    ).subscribe({
      next: (res) => {
        this.changingPassword = false;
        this.cdr.detectChanges();
        if (res.success) {
          this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.snackBar.open(res.message || 'Failed to change password', 'Close', { duration: 5000 });
        }
      },
      error: () => {
        this.changingPassword = false;
        this.cdr.detectChanges();
        this.snackBar.open('Failed to change password', 'Close', { duration: 4000 });
      }
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('Logo file must be 2 MB or less.', 'Close', { duration: 4000 });
        return;
      }
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreviewUrl = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  uploadLogo(): void {
    if (!this.logoFile) return;
    this.uploadingLogo = true;
    const formData = new FormData();
    formData.append('logo', this.logoFile);
    this.http.post<{ logoUrl: string }>(`${this.apiUrl}/auth/upload-logo`, formData).subscribe({
      next: (res) => {
        if (this.profile) this.profile.logoUrl = res.logoUrl;
        this.logoFile = null;
        this.logoPreviewUrl = null;
        this.uploadingLogo = false;
        this.cdr.detectChanges();
        this.snackBar.open('Logo uploaded successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.uploadingLogo = false;
        this.cdr.detectChanges();
        this.snackBar.open(err.error?.message || 'Failed to upload logo', 'Close', { duration: 4000 });
      }
    });
  }
}
