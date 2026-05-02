import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  yearly = false;
  customEmployees = 36;

  get customPrice(): number {
    const extra = Math.max(0, this.customEmployees - 35);
    return 14500 + extra * 200;
  }

  onEmployeesChange(val: number): void {
    if (!val || val < 36) this.customEmployees = 36;
  }

  incrementEmployees(): void {
    this.customEmployees++;
  }

  decrementEmployees(): void {
    if (this.customEmployees > 36) this.customEmployees--;
  }
}
