import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="transaction-list">
      <div class="header">
        <h1>Transactions</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> New Transaction
        </button>
      </div>
      <mat-card>
        <mat-card-content>
          <p>Transaction list will appear here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .transaction-list { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { color: #000000; margin: 0; }
    button { background-color: #C7AE6A; color: white; }
    button:hover { background-color: #b99a45; }
  `]
})
export class TransactionListComponent {}
