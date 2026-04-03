import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="admin-panel">
      <div class="orb orb-left"></div>
      <div class="orb orb-right"></div>
      <h1>Admin Panel</h1>
      <mat-card>
        <mat-card-header>
          <mat-card-title>System Administration</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Admin features will be available here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-panel {
      min-height: 100vh;
      background: #060B18;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      overflow-x: hidden;
    }

    .orb {
      position: fixed; border-radius: 50%;
      filter: blur(130px); opacity: 0.28; pointer-events: none; z-index: 0;
    }
    .orb-left  { width: 560px; height: 560px; background: #4F46E5; top: -200px; left: -200px; }
    .orb-right { width: 440px; height: 440px; background: #06B6D4; bottom: -100px; right: -140px; }

    h1 {
      color: #F8FAFC;
      margin-bottom: 2rem;
      font-weight: 800;
      font-size: 2.5rem;
      position: relative;
      z-index: 1;
    }

    mat-card {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(16px);
      border-radius: 16px !important;
      position: relative;
      z-index: 1;
      transition: all 0.3s ease;
    }

    mat-card:hover {
      border-color: rgba(99,102,241,0.35);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }

    mat-card-title {
      color: #F1F5F9 !important;
      font-weight: 700;
    }

    mat-card-content p {
      color: #94A3B8;
    }
  `]
})
export class AdminPanelComponent {}
