import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateNoticeDialogComponent } from './create-notice-dialog.component';

interface Notice {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="notices-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Notices & Alerts</h1>
            <p class="subtitle">Important updates and system notifications</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Create Notice
            </button>
            <button mat-raised-button color="accent" (click)="markAllAsRead()">
              <mat-icon>done_all</mat-icon>
              Mark All Read
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card">
            <mat-icon class="stat-icon total">notifications</mat-icon>
            <div class="stat-info">
              <p class="stat-label">Total Notices</p>
              <h3 class="stat-value">{{ notices.length }}</h3>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon unread">mark_email_unread</mat-icon>
            <div class="stat-info">
              <p class="stat-label">Unread</p>
              <h3 class="stat-value">{{ getUnreadCount() }}</h3>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon class="stat-icon priority">priority_high</mat-icon>
            <div class="stat-info">
              <p class="stat-label">High Priority</p>
              <h3 class="stat-value">{{ getHighPriorityCount() }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="filters">
        <mat-chip-set>
          <mat-chip [highlighted]="activeFilter === 'all'" (click)="setFilter('all')">
            All Notices
          </mat-chip>
          <mat-chip [highlighted]="activeFilter === 'unread'" (click)="setFilter('unread')">
            Unread ({{ getUnreadCount() }})
          </mat-chip>
          <mat-chip [highlighted]="activeFilter === 'tax'" (click)="setFilter('tax')">
            Tax & Compliance
          </mat-chip>
          <mat-chip [highlighted]="activeFilter === 'payroll'" (click)="setFilter('payroll')">
            Payroll
          </mat-chip>
          <mat-chip [highlighted]="activeFilter === 'system'" (click)="setFilter('system')">
            System Updates
          </mat-chip>
        </mat-chip-set>
      </div>

      <!-- Notices List -->
      <div class="notices-list">
        @if (getFilteredNotices().length === 0) {
          <mat-card class="empty-state">
            <mat-icon>notifications_none</mat-icon>
            <h3>No notices to display</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </mat-card>
        } @else {
          @for (notice of getFilteredNotices(); track notice.id) {
            <mat-card class="notice-card" [class.unread]="!notice.read" [class]="'notice-' + notice.type">
              <div class="notice-header">
                <div class="notice-meta">
                  <mat-icon class="type-icon">{{ getNoticeIcon(notice.type) }}</mat-icon>
                  <div class="notice-title-group">
                    <h3>{{ notice.title }}
                      @if (!notice.read) {
                        <span class="unread-badge"></span>
                      }
                    </h3>
                    <div class="notice-tags">
                      <mat-chip class="category-chip">{{ notice.category }}</mat-chip>
                      @if (notice.priority === 'high') {
                        <mat-chip class="priority-chip high">High Priority</mat-chip>
                      }
                      <span class="date">{{ formatDate(notice.date) }}</span>
                    </div>
                  </div>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="noticeMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #noticeMenu="matMenu">
                  <button mat-menu-item (click)="toggleRead(notice)">
                    <mat-icon>{{ notice.read ? 'mark_email_unread' : 'done' }}</mat-icon>
                    <span>Mark as {{ notice.read ? 'Unread' : 'Read' }}</span>
                  </button>
                  <button mat-menu-item (click)="deleteNotice(notice.id)">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </div>
              <div class="notice-content">
                <p>{{ notice.message }}</p>
              </div>
              @if (!notice.read) {
                <div class="notice-actions">
                  <button mat-button (click)="markAsRead(notice)">Mark as Read</button>
                </div>
              }
            </mat-card>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .notices-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .title-section h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .stat-icon.total { color: #667eea; }
    .stat-icon.unread { color: #f59e0b; }
    .stat-icon.priority { color: #ef4444; }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-value {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
    }

    /* Filters */
    .filters {
      margin-bottom: 1.5rem;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    mat-chip {
      cursor: pointer;
    }

    /* Notices List */
    .notices-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notice-card {
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }

    .notice-card.unread {
      background: #fefce8;
      border-left-color: #f59e0b;
    }

    .notice-card.notice-error {
      border-left-color: #ef4444;
    }

    .notice-card.notice-warning {
      border-left-color: #f59e0b;
    }

    .notice-card.notice-info {
      border-left-color: #3b82f6;
    }

    .notice-card.notice-success {
      border-left-color: #10b981;
    }

    .notice-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .notice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .notice-meta {
      display: flex;
      gap: 1rem;
      flex: 1;
    }

    .type-icon {
      color: #667eea;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .notice-title-group {
      flex: 1;
    }

    .notice-title-group h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .unread-badge {
      width: 8px;
      height: 8px;
      background: #f59e0b;
      border-radius: 50%;
      display: inline-block;
    }

    .notice-tags {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .category-chip {
      font-size: 0.75rem;
      height: 24px;
    }

    .priority-chip.high {
      background: #fee2e2 !important;
      color: #dc2626 !important;
    }

    .date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .notice-content p {
      margin: 0;
      color: #4b5563;
      line-height: 1.6;
    }

    .notice-actions {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #6b7280;
    }

    .empty-state p {
      margin: 0;
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .notices-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .stats-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NoticesComponent implements OnInit {
  activeFilter: string = 'all';
  notices: Notice[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    // Sample notices - replace with API call
    this.notices = [
      {
        id: 1,
        title: 'PAYE Filing Deadline Approaching',
        message: 'Your PAYE filing is due on March 15, 2026. Please ensure all employee tax deductions are up to date.',
        type: 'warning',
        date: new Date('2026-03-01'),
        read: false,
        priority: 'high',
        category: 'Tax & Compliance'
      },
      {
        id: 2,
        title: 'NIS Contribution Update',
        message: 'NIS contribution rates have been updated for Q2 2026. The new rates are now in effect.',
        type: 'info',
        date: new Date('2026-02-28'),
        read: false,
        priority: 'medium',
        category: 'Payroll'
      },
      {
        id: 3,
        title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance on March 10, 2026 from 2:00 AM - 4:00 AM EST. Services may be temporarily unavailable.',
        type: 'info',
        date: new Date('2026-02-25'),
        read: true,
        priority: 'low',
        category: 'System Updates'
      },
      {
        id: 4,
        title: 'Payroll Processed Successfully',
        message: 'February 2026 payroll has been processed successfully. All employees have been paid.',
        type: 'success',
        date: new Date('2026-02-15'),
        read: true,
        priority: 'low',
        category: 'Payroll'
      },
      {
        id: 5,
        title: 'Education Tax Return Overdue',
        message: 'Your Education Tax return for January 2026 is overdue. Please file immediately to avoid penalties.',
        type: 'error',
        date: new Date('2026-02-20'),
        read: false,
        priority: 'high',
        category: 'Tax & Compliance'
      }
    ];
  }

  getUnreadCount(): number {
    return this.notices.filter(n => !n.read).length;
  }

  getHighPriorityCount(): number {
    return this.notices.filter(n => n.priority === 'high').length;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  getFilteredNotices(): Notice[] {
    switch (this.activeFilter) {
      case 'unread':
        return this.notices.filter(n => !n.read);
      case 'tax':
        return this.notices.filter(n => n.category === 'Tax & Compliance');
      case 'payroll':
        return this.notices.filter(n => n.category === 'Payroll');
      case 'system':
        return this.notices.filter(n => n.category === 'System Updates');
      default:
        return this.notices;
    }
  }

  getNoticeIcon(type: string): string {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return new Date(date).toLocaleDateString('en-JM', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  markAsRead(notice: Notice) {
    notice.read = true;
  }

  toggleRead(notice: Notice) {
    notice.read = !notice.read;
  }

  markAllAsRead() {
    this.notices.forEach(n => n.read = true);
  }

  deleteNotice(id: number) {
    this.notices = this.notices.filter(n => n.id !== id);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateNoticeDialogComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addNotice(result);
      }
    });
  }

  addNotice(noticeData: any) {
    const newNotice: Notice = {
      id: Math.max(...this.notices.map(n => n.id), 0) + 1,
      title: noticeData.title,
      message: noticeData.message,
      type: noticeData.type,
      date: new Date(),
      read: false,
      priority: noticeData.priority,
      category: noticeData.category
    };

    // Add to the beginning of the array (most recent first)
    this.notices.unshift(newNotice);
  }
}
