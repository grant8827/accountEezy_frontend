import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../components/header/header.component';

interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, HeaderComponent],
  template: `
    <app-header></app-header>

    <main class="about-page">
      <section class="hero-section">
        <div class="container hero-inner">
          <h1>About HRBooks360</h1>
          <p>
            We're on a mission to empower Jamaican businesses with simple, powerful financial
            management tools that help them grow and succeed in today's competitive market.
          </p>
        </div>
      </section>

      <section class="story-section">
        <div class="container story-grid">
          <div>
            <h2>Our Story</h2>
            <p>
              HRBooks360 was born from the frustration of small business owners in Jamaica who
              struggled with complex financial software that wasn't designed for local needs. Our
              founders, experienced entrepreneurs themselves, understood the unique challenges of
              running a business in Jamaica.
            </p>
            <p>
              We set out to create a solution that would simplify financial management while
              ensuring full compliance with Jamaica's tax laws and business regulations. Today,
              HRBooks360 serves businesses of all sizes across the island.
            </p>
            <p>
              Our commitment goes beyond just software. We're building a community of successful
              Jamaican businesses, supported by technology that truly understands their needs.
            </p>
          </div>

          <div class="story-visual" aria-hidden="true">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
        </div>
      </section>

      <section class="values-section">
        <div class="container">
          <div class="section-heading">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div class="values-grid">
            <article class="value-card" *ngFor="let value of values">
              <mat-icon>{{ value.icon }}</mat-icon>
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="journey-section">
        <div class="container">
          <div class="section-heading">
            <h2>Our Journey</h2>
          </div>

          <div class="timeline">
            <article class="milestone" *ngFor="let milestone of milestones">
              <div class="year">{{ milestone.year }}</div>
              <div>
                <h3>{{ milestone.title }}</h3>
                <p>{{ milestone.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="team-section">
        <div class="container">
          <div class="section-heading">
            <h2>Our Team</h2>
            <p>Passionate professionals dedicated to your business success</p>
          </div>

          <div class="team-grid">
            <article class="team-card">
              <div class="team-icon">
                <mat-icon>groups</mat-icon>
              </div>
              <h3>Development Team</h3>
              <p>Expert developers building robust, secure financial solutions.</p>
            </article>

            <article class="team-card">
              <div class="team-icon">
                <mat-icon>support_agent</mat-icon>
              </div>
              <h3>Support Team</h3>
              <p>Local experts providing exceptional customer support.</p>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div>
          <div class="footer-logo">HR<span>Books360</span></div>
          <p>Accounting and payroll made simple for Jamaican businesses.</p>
        </div>

        <nav class="footer-links">
          <a routerLink="/">Home</a>
          <a routerLink="/pricing">Pricing</a>
          <a routerLink="/pricing">Get Started</a>
        </nav>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      color: var(--text-primary);
      background: var(--background-primary);
    }

    .container {
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
    }

    .hero-section {
      background: linear-gradient(135deg, var(--primary-brand) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 96px 0;
    }

    .hero-inner {
      text-align: center;
    }

    .hero-section h1 {
      color: #fac83e;
      font-size: clamp(2.5rem, 6vw, 3.5rem);
      line-height: 1.05;
      margin-bottom: 24px;
    }

    .hero-section p {
      max-width: 800px;
      margin: 0 auto;
      font-size: clamp(1.1rem, 2vw, 1.25rem);
      line-height: 1.7;
      opacity: 0.92;
    }

    .story-section,
    .journey-section {
      padding: 80px 0;
    }

    .story-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 1fr);
      gap: 56px;
      align-items: center;
    }

    h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
      margin-bottom: 24px;
      color: var(--text-primary);
    }

    .story-section p,
    .milestone p,
    .team-card p,
    .value-card p {
      color: var(--text-secondary);
      line-height: 1.75;
    }

    .story-section p {
      font-size: 1.08rem;
      margin-bottom: 18px;
    }

    .story-visual {
      min-height: 300px;
      border-radius: 8px;
      background: var(--neutral-100);
      display: grid;
      place-items: center;
      border: 1px solid var(--neutral-200);
    }

    .story-visual mat-icon {
      width: 120px;
      height: 120px;
      font-size: 120px;
      color: var(--primary-brand);
      opacity: 0.72;
    }

    .values-section,
    .team-section {
      background: var(--background-secondary);
      padding: 80px 0;
    }

    .section-heading {
      text-align: center;
      margin-bottom: 56px;
    }

    .section-heading h2 {
      margin-bottom: 12px;
    }

    .section-heading p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 1.15rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 24px;
    }

    .value-card,
    .team-card {
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: 8px;
      padding: 28px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .value-card:hover,
    .team-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(23, 43, 77, 0.1);
    }

    .value-card mat-icon {
      width: 40px;
      height: 40px;
      font-size: 40px;
      color: var(--primary-brand);
      margin-bottom: 18px;
    }

    h3 {
      margin: 0 0 12px;
      color: var(--text-primary);
      font-size: 1.15rem;
    }

    .value-card p,
    .team-card p {
      margin: 0;
      font-size: 0.95rem;
    }

    .timeline {
      max-width: 900px;
      margin: 0 auto;
    }

    .milestone {
      display: flex;
      gap: 28px;
      align-items: flex-start;
      margin-bottom: 34px;
    }

    .milestone:last-child {
      margin-bottom: 0;
    }

    .year {
      min-width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary-brand);
      color: white;
      display: grid;
      place-items: center;
      font-weight: 800;
      box-shadow: 0 8px 20px rgba(0, 82, 204, 0.22);
    }

    .milestone h3 {
      margin-top: 8px;
    }

    .milestone p {
      margin: 0;
      font-size: 1rem;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px;
      max-width: 640px;
      margin: 0 auto;
    }

    .team-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--neutral-200);
      display: grid;
      place-items: center;
      margin: 0 auto 18px;
    }

    .team-icon mat-icon {
      width: 42px;
      height: 42px;
      font-size: 42px;
      color: var(--neutral-600);
    }

    .footer {
      background: var(--neutral-900);
      color: white;
      padding: 36px 0;
    }

    .footer-inner {
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: center;
    }

    .footer-logo {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .footer-logo span {
      color: var(--primary-light);
    }

    .footer p {
      margin: 0;
      color: var(--neutral-300);
    }

    .footer-links {
      display: flex;
      gap: 22px;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }

    .footer-links a:hover {
      color: var(--primary-light);
    }

    @media (max-width: 900px) {
      .story-grid,
      .values-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .hero-section,
      .story-section,
      .values-section,
      .journey-section,
      .team-section {
        padding: 56px 0;
      }

      .story-grid,
      .values-grid,
      .team-grid {
        grid-template-columns: 1fr;
      }

      .milestone {
        gap: 18px;
      }

      .year {
        min-width: 64px;
        height: 64px;
        font-size: 0.9rem;
      }

      .footer-inner {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class AboutPageComponent {
  values: AboutValue[] = [
    {
      icon: 'security',
      title: 'Security First',
      description: 'We prioritize the security of your financial data with bank-grade encryption and security protocols.'
    },
    {
      icon: 'support_agent',
      title: 'Local Support',
      description: 'Our team understands Jamaican business regulations and provides expert local support.'
    },
    {
      icon: 'business_center',
      title: 'Business Focus',
      description: 'Built specifically for Jamaican businesses with features that matter to local operations.'
    },
    {
      icon: 'groups',
      title: 'Community Driven',
      description: 'We listen to our users and continuously improve based on real business needs.'
    }
  ];

  milestones: Milestone[] = [
    {
      year: '2024',
      title: 'Company Founded',
      description: 'HRBooks360 was established with a vision to simplify financial management for Jamaican businesses.'
    },
    {
      year: '2024',
      title: 'First Release',
      description: 'Launched our core platform with business registration and basic financial tools.'
    },
    {
      year: '2025',
      title: 'Tax Integration',
      description: 'Added comprehensive Jamaican tax compliance features including GCT, PAYE, and statutory deductions.'
    },
    {
      year: '2025',
      title: 'Growing Community',
      description: 'Now serving hundreds of businesses across Jamaica with continued growth and expansion.'
    }
  ];
}
