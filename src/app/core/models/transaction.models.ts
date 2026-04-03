export type TransactionType = 1 | 2;
export type TransactionFrequency = 1 | 2 | 3;
export type TransactionStatus = 1 | 2;

export const FREQUENCY_LABELS: Record<number, string> = {
  0: 'Daily',   // fallback for legacy rows migrated with default 0
  1: 'Daily',
  2: 'Weekly',
  3: 'Monthly'
};

export const STATUS_LABELS: Record<number, string> = {
  0: 'Pending', // fallback for legacy rows migrated with default 0
  1: 'Pending',
  2: 'Cleared'
};

export const INCOME_CATEGORIES = [
  'Sales',
  'Service Revenue',
  'Other Income'
];

export interface CategoryGroup {
  label: string;
  options: string[];
}

export const EXPENSE_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: 'General',
    options: ['Rent', 'Payroll', 'Inventory', 'Marketing', 'Travel', 'Other Expense']
  },
  {
    label: 'Utilities',
    options: [
      'Light Bill',
      'Water Bill',
      'Telephone Bill',
      'Internet Bill',
      'Waste Management Bill',
      'Gas Bill'
    ]
  }
];

export interface TransactionItem {
  id: number;
  amount: number;
  type: TransactionType;
  gctApplicable: boolean;
  gctAmount: number;
  category: string;
  description: string;
  frequency: TransactionFrequency;
  status: TransactionStatus;
  date: string;
}

export interface TransactionRequest {
  amount: number;
  type: TransactionType;
  gctApplicable: boolean;
  category: string;
  description: string;
  frequency: TransactionFrequency;
  status: TransactionStatus;
  date: string;
}
