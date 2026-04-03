import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="site-header">
      <div class="header-container">
        <div class="logo">
          <a routerLink="/">
            <span class="logo-icon">💼</span>
            <span class="logo-text">Account<span class="logo-accent">Eezy</span></span>
          </a>
        </div>

        <nav class="nav-menu">
          <a routerLink="/features" class="nav-link">Features</a>
          <a routerLink="/pricing" class="nav-link">Pricing</a>
          <a routerLink="/about" class="nav-link">About</a>
        </nav>

        <div class="header-actions">
          <a routerLink="/login" class="btn-ghost-sm">Sign In</a>
          <a routerLink="/register" class="btn-primary-sm">Get Started</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--neutral-200);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }

    .logo a {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-weight: 800;
      font-size: 1.25rem;
      color: var(--text-primary);
      transition: transform 0.2s ease;
    }

    .logo a:hover {
      transform: scale(1.02);
    }

    .logo-icon {
      font-size: 1.5rem;
      filter: drop-shadow(0 2px 4px rgba(79, 70, 229, 0.2));
    }

    .logo-accent {
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-menu {
      display: flex;
      gap: 32px;
      align-items: center;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s ease;
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }

    .nav-link:hover {
      color: var(--primary-color);
    }

    .nav-link:hover::after {
      transform: scaleX(1);
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-ghost-sm {
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      color: var(--text-secondary);
      background: transparent;
      border: 1px solid var(--neutral-300);
      transition: all 0.2s ease;
    }

    .btn-ghost-sm:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(79, 70, 229, 0.05);
    }

    .btn-primary-sm {
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      color: white;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
      transition: all 0.2s ease;
    }

    .btn-primary-sm:hover {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }

      .header-container {
        padding: 12px 20px;
      }

      .btn-ghost-sm {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {}
