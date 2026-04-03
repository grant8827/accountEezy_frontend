import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-debug-env-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="debug-page">
      <h1>Debug Environment</h1>
      <mat-card>
        <mat-card-content>
          <p>Environment: {{ environment }}</p>
          <p>API URL: {{ apiUrl }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .debug-page { padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { color: #000000; margin-bottom: 2rem; }
  `]
})
export class DebugEnvPageComponent {
  environment = 'development';
  apiUrl = 'http://localhost:5000/api';
}
