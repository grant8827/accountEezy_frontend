import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionsService } from '../../core/services/transactions.service';
import {
  CategoryGroup,
  EXPENSE_CATEGORY_GROUPS,
  FREQUENCY_LABELS,
  INCOME_CATEGORIES,
  STATUS_LABELS,
  TransactionFrequency,
  TransactionItem
} from '../../core/models/transaction.models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transactionsService = inject(TransactionsService);

  readonly FREQUENCY_LABELS = FREQUENCY_LABELS;
  readonly STATUS_LABELS = STATUS_LABELS;
  readonly INCOME_CATEGORIES = INCOME_CATEGORIES;
  readonly EXPENSE_CATEGORY_GROUPS: CategoryGroup[] = EXPENSE_CATEGORY_GROUPS;

  readonly transactions = signal<TransactionItem[]>([]);
  readonly frequencyFilter = signal<TransactionFrequency | 0>(0);
  readonly showModal = signal(false);
  readonly submitting = signal(false);
  readonly loading = signal(false);
  readonly submitError = signal('');
  readonly loadError = signal('');

  readonly filteredTransactions = computed(() => {
    const f = this.frequencyFilter();
    const all = this.transactions();
    return f === 0 ? all : all.filter(t => t.frequency === f);
  });

  readonly totalIncome = computed(() =>
    this.transactions().filter(t => t.type === 1).reduce((s, t) => s + t.amount + t.gctAmount, 0)
  );
  readonly totalExpense = computed(() =>
    this.transactions().filter(t => t.type === 2).reduce((s, t) => s + t.amount + t.gctAmount, 0)
  );
  readonly netBalance = computed(() => this.totalIncome() - this.totalExpense());

  readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: [1 as 1 | 2, [Validators.required]],
    gctApplicable: [false],
    category: ['', [Validators.required]],
    description: [''],
    frequency: [1 as TransactionFrequency, [Validators.required]],
    status: [1 as 1 | 2],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]]
  });

  get currentType(): 1 | 2 { return this.form.getRawValue().type; }

  setType(t: 1 | 2) {
    this.form.patchValue({ type: t, category: '' });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loadError.set('');
    this.loading.set(true);
    this.transactionsService.getAll().subscribe({
      next: items => {
        this.transactions.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.title ?? err?.message ?? null;
        this.loadError.set(msg ? String(msg) : 'Could not load transactions.');
      }
    });
  }

  openModal()  {
    this.submitError.set('');
    this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
    this.submitError.set('');
    this.submitting.set(false);
    this.form.reset({
      amount: 0, type: 1, gctApplicable: false, category: '',
      description: '', frequency: 1, status: 1,
      date: new Date().toISOString().slice(0, 10)
    });
  }

  submit() {
    // Mark all fields dirty so validation hints show
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.submitError.set('');
    const v = this.form.getRawValue();

    this.transactionsService.create({
      ...v,
      amount: +v.amount,
      frequency: +v.frequency as TransactionFrequency,
      status: +v.status as 1 | 2,
      date: new Date(v.date).toISOString()
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeModal();
        this.load();
        this.transactionsService.markChanged();
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err?.error?.title ?? err?.error ?? err?.message ?? null;
        this.submitError.set(msg ? String(msg) : 'Failed to save. Please try again.');
      }
    });
  }

  remove(id: number) {
    if (!confirm('Delete this transaction? This cannot be undone.')) return;
    this.transactionsService.delete(id).subscribe({
      next: () => {
        this.load();
        this.transactionsService.markChanged();
      },
      error: () => this.loadError.set('Failed to delete transaction. Please try again.')
    });
  }

  setFrequencyFilter(f: TransactionFrequency | 0) {
    this.frequencyFilter.set(f);
  }

  exportCsv() {
    const rows = this.filteredTransactions();
    const headers = ['Date', 'Type', 'Category', 'Description', 'Frequency', 'Amount (JMD)', 'GCT Amount', 'Status'];
    const lines = rows.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type === 1 ? 'Income' : 'Expense',
      t.category,
      t.description,
      FREQUENCY_LABELS[t.frequency],
      t.amount.toFixed(2),
      t.gctAmount.toFixed(2),
      STATUS_LABELS[t.status]
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

