import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { DashboardSummary, So1Report } from '../../core/models/dashboard.models';
import { DashboardService } from '../../core/services/dashboard.service';
import { TransactionItem } from '../../core/models/transaction.models';
import { TransactionsService } from '../../core/services/transactions.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionsService = inject(TransactionsService);
  private changedSub?: Subscription;

  readonly summary = signal<DashboardSummary | null>(null);
  readonly so1 = signal<So1Report | null>(null);
  readonly transactions = signal<TransactionItem[]>([]);

  readonly lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { color: '#334155', font: { family: 'inherit', size: 12 } } },
      tooltip: { callbacks: { label: ctx => `J$ ${(ctx.raw as number).toLocaleString('en-JM', { minimumFractionDigits: 2 })}` } }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { display: false } },
      y: { ticks: { color: '#64748b', callback: v => `J$ ${Number(v).toLocaleString()}` }, grid: { color: '#f1f5f9' } }
    }
  };

  readonly doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#334155', font: { family: 'inherit', size: 11 }, padding: 12 } },
      tooltip: { callbacks: { label: ctx => `J$ ${(ctx.raw as number).toLocaleString('en-JM', { minimumFractionDigits: 2 })}` } }
    }
  };

  private static last6Months(): { label: string; year: number; month: number }[] {
    const now = new Date();
    const result: { label: string; year: number; month: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        year: d.getFullYear(),
        month: d.getMonth() + 1
      });
    }
    return result;
  }

  readonly revenueExpenseChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const txns = this.transactions();
    const months = DashboardComponent.last6Months();

    const income = months.map(m =>
      txns
        .filter(t => {
          const d = new Date(t.date);
          return t.type === 1 && d.getUTCFullYear() === m.year && d.getUTCMonth() + 1 === m.month;
        })
        .reduce((s, t) => s + t.amount, 0)
    );

    const expense = months.map(m =>
      txns
        .filter(t => {
          const d = new Date(t.date);
          return t.type === 2 && d.getUTCFullYear() === m.year && d.getUTCMonth() + 1 === m.month;
        })
        .reduce((s, t) => s + t.amount, 0)
    );

    const balance = income.map((inc, i) => inc - expense[i]);

    return {
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Income',
          data: income,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          tension: 0.35,
          fill: true
        },
        {
          label: 'Expenditure',
          data: expense,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#ef4444',
          pointRadius: 4,
          tension: 0.35,
          fill: false
        },
        {
          label: 'Net Balance',
          data: balance,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#6366f1',
          pointRadius: 4,
          tension: 0.35,
          fill: false
        }
      ]
    };
  });

  readonly taxChartData = computed<ChartConfiguration['data']>(() => {
    const s = this.summary();
    return {
      labels: ['GCT', 'Payroll Tax'],
      datasets: [
        {
          data: [s?.gctLiability ?? 0, s?.payrollTaxLiability ?? 0],
          backgroundColor: ['#f59e0b', '#6366f1'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 3,
          hoverOffset: 8
        }
      ]
    };
  });

  private loadAll(): void {
    this.dashboardService.getSummary().subscribe(data => this.summary.set(data));
    this.transactionsService.getAll().subscribe(data => this.transactions.set(data));
    const now = new Date();
    this.dashboardService.getSo1(now.getMonth() + 1, now.getFullYear()).subscribe(data => this.so1.set(data));
  }

  ngOnInit(): void {
    this.loadAll();
    this.changedSub = this.transactionsService.changed$.subscribe(() => this.loadAll());
  }

  ngOnDestroy(): void {
    this.changedSub?.unsubscribe();
  }
}
