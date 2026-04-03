import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTableModule, MatIconModule],
  template: `
    <div class="business-list">
      <div class="header">
        <h1>Business Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> Add Business
        </button>
      </div>
      <mat-card>
        <mat-card-content>
          <p>Business list will appear here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .business-list { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { color: #000000; margin: 0; }
    button { background-color: #C7AE6A; color: white; }
    button:hover { background-color: #b99a45; }
  `]
})
export class BusinessListComponent {}
