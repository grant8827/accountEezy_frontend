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
          <a routerLink="/" (click)="closeMenu()">
            <span class="logo-icon">💼</span>
            <span class="logo-text">HRBooks<span class="logo-accent">360</span></span>
          </a>
        </div>

        <nav class="nav-menu">
          <a routerLink="/" class="nav-link">Home</a>
          <a routerLink="/features" class="nav-link">Features</a>
          <a routerLink="/pricing" class="nav-link">Pricing</a>
          <a routerLink="/about" class="nav-link">About</a>
        </nav>

        <div class="header-actions">
          <a routerLink="/login" class="btn-ghost-sm">Sign In</a>
          <a routerLink="/pricing" class="btn-primary-sm">Get Started</a>
        </div>

        <button
          type="button"
          class="mobile-menu-toggle"
          [class.is-open]="isMenuOpen"
          [attr.aria-expanded]="isMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          (click)="toggleMenu()"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div id="mobile-menu" class="mobile-menu" [class.is-open]="isMenuOpen">
        <a routerLink="/" class="mobile-link" (click)="closeMenu()">Home</a>
        <a routerLink="/features" class="mobile-link" (click)="closeMenu()">Features</a>
        <a routerLink="/pricing" class="mobile-link" (click)="closeMenu()">Pricing</a>
        <a routerLink="/about" class="mobile-link" (click)="closeMenu()">About</a>
        <div class="mobile-actions">
          <a routerLink="/login" class="btn-ghost-sm mobile-action" (click)="closeMenu()">Sign In</a>
          <a routerLink="/pricing" class="btn-primary-sm mobile-action" (click)="closeMenu()">Get Started</a>
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

    .mobile-menu-toggle {
      display: none;
      width: 42px;
      height: 42px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--bg-card);
      color: var(--text-main);
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      transition: border-color 150ms ease, background 150ms ease;
    }

    .mobile-menu-toggle span {
      display: block;
      width: 18px;
      height: 2px;
      border-radius: 999px;
      background: currentColor;
      transition: transform 150ms ease, opacity 150ms ease;
    }

    .mobile-menu-toggle:hover {
      border-color: var(--color-primary);
      background: var(--badge-success-bg);
    }

    .mobile-menu-toggle.is-open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .mobile-menu-toggle.is-open span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.is-open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .mobile-menu {
      display: none;
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
        gap: 16px;
      }

      .header-actions {
        display: none;
      }

      .mobile-menu-toggle {
        display: inline-flex;
      }

      .mobile-menu {
        display: block;
        width: min(100% - 32px, 420px);
        margin: 0 auto;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
        transition: max-height 180ms ease, opacity 150ms ease, padding 180ms ease;
      }

      .mobile-menu.is-open {
        max-height: 420px;
        opacity: 1;
        pointer-events: auto;
        padding: 4px 0 16px;
      }

      .mobile-link {
        display: block;
        padding: 13px 14px;
        color: var(--text-main);
        text-decoration: none;
        font-weight: 700;
        border-bottom: 1px solid var(--border-color);
      }

      .mobile-link:hover {
        color: var(--color-primary);
        background: var(--badge-success-bg);
      }

      .mobile-actions {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding-top: 14px;
      }

      .mobile-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
