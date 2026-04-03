import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="landing-page">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-container">
          <h1 class="logo">AccountEezy</h1>
          <div class="nav-links">
            <a (click)="scrollTo('home')">Home</a>
            <a (click)="scrollTo('about')">About</a>
            <a (click)="scrollTo('contact')">Contact</a>
            <a routerLink="/login" mat-button>Login</a>
            <a routerLink="/pricing" mat-raised-button color="primary">Get Started</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section id="home" class="hero">
        <div class="hero-content">
          <h1>Jamaica's Premier Financial Staffing System</h1>
          <p>Streamline your payroll, track employees, and manage finances with ease</p>
          <button mat-raised-button color="primary" routerLink="/register">Start Free Trial</button>
        </div>
      </section>

      <!-- Features Section -->
      <section id="about" class="features">
        <h2>Why Choose AccountEezy?</h2>
        <div class="features-grid">
          <mat-card>
            <mat-icon>people</mat-icon>
            <h3>Employee Management</h3>
            <p>Track and manage all your employees in one place</p>
          </mat-card>
          <mat-card>
            <mat-icon>payment</mat-icon>
            <h3>Payroll Processing</h3>
            <p>Automated payroll calculation and processing</p>
          </mat-card>
          <mat-card>
            <mat-icon>assessment</mat-icon>
            <h3>Financial Reports</h3>
            <p>Generate comprehensive financial reports instantly</p>
          </mat-card>
          <mat-card>
            <mat-icon>security</mat-icon>
            <h3>Secure & Compliant</h3>
            <p>Bank-level security and Jamaica tax compliance</p>
          </mat-card>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="contact">
        <h2>Get In Touch</h2>
        <p>Email: support&#64;accounteezy.com</p>
        <p>Phone: +1 (876) 555-0100</p>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 AccountEezy. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      width: 100%;
      min-height: 100vh;
      background: #060B18;
      position: relative;
      overflow-x: hidden;
    }

    .landing-page::before {
      content: '';
      position: fixed;
      top: -200px;
      left: -200px;
      width: 560px;
      height: 560px;
      background: #4F46E5;
      border-radius: 50%;
      filter: blur(130px);
      opacity: 0.28;
      pointer-events: none;
      z-index: 0;
    }

    .landing-page::after {
      content: '';
      position: fixed;
      bottom: -100px;
      right: -140px;
      width: 440px;
      height: 440px;
      background: #06B6D4;
      border-radius: 50%;
      filter: blur(130px);
      opacity: 0.28;
      pointer-events: none;
      z-index: 0;
    }

    .navbar {
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(16px);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .logo {
      background: linear-gradient(135deg, #818CF8, #22D3EE);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      font-size: 1.8rem;
      margin: 0;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      color: #94A3B8;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: #F1F5F9;
    }

    .hero {
      text-align: center;
      padding: 8rem 2rem;
      position: relative;
      z-index: 1;
    }

    .hero-content h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #F8FAFC, #818CF8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-content p {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
      color: #94A3B8;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .features {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #F8FAFC;
      font-weight: 800;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .features-grid mat-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(16px);
      text-align: center;
      padding: 2rem;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .features-grid mat-card:hover {
      border-color: rgba(99,102,241,0.35);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }

    .features-grid mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #4F46E5, #06B6D4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    .features-grid h3 {
      color: #F1F5F9;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .features-grid p {
      color: #64748B;
    }

    .contact {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255,255,255,0.03);
      border-top: 1px solid rgba(255,255,255,0.07);
      position: relative;
      z-index: 1;
    }

    .contact h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #F8FAFC;
      font-weight: 800;
    }

    .contact p {
      font-size: 1.2rem;
      color: #94A3B8;
      margin: 0.5rem 0;
    }

    .footer {
      background: rgba(0,0,0,0.3);
      border-top: 1px solid rgba(255,255,255,0.07);
      text-align: center;
      padding: 2rem;
      position: relative;
      z-index: 1;
    }

    .footer p {
      margin: 0;
      color: #64748B;
    }

    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
      }
      .hero {
        padding: 6rem 2rem;
      }
    }
  `]
})
export class LandingPageComponent {
  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
