import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="api-test">
      <h1>API Test</h1>
      <mat-card>
        <mat-card-content>
          <p>API testing tools will appear here.</p>
          <button mat-raised-button color="primary">Test Connection</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .api-test { padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { color: #000000; margin-bottom: 2rem; }
    button { background-color: #C7AE6A; color: white; margin-top: 1rem; }
  `]
})
export class ApiTestComponent {}
