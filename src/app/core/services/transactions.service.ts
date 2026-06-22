import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import {
  TransactionFrequency,
  TransactionItem,
  TransactionRequest,
  TransactionStatus,
  TransactionType
} from '../models/transaction.models';
import { environment } from '../../../environments/environment';

interface TransactionApiItem extends Omit<TransactionItem, 'type' | 'frequency' | 'status'> {
  type: TransactionType | string;
  frequency: TransactionFrequency | string;
  status: TransactionStatus | string;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly apiUrl = `${environment.apiUrl}/transactions`;

  /** Emits whenever a transaction is created or deleted — lets other components react in real-time */
  private readonly _changed$ = new Subject<void>();
  readonly changed$ = this._changed$.asObservable();

  markChanged(): void { this._changed$.next(); }

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<TransactionApiItem[]>(this.apiUrl).pipe(
      map(items => items.map(item => this.normalizeItem(item)))
    );
  }

  create(payload: TransactionRequest) {
    return this.http.post<TransactionApiItem>(this.apiUrl, payload).pipe(
      map(item => this.normalizeItem(item))
    );
  }

  update(id: number, payload: TransactionRequest) {
    return this.http.put<TransactionApiItem>(`${this.apiUrl}/${id}`, payload).pipe(
      map(item => this.normalizeItem(item))
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalizeItem(item: TransactionApiItem): TransactionItem {
    return {
      ...item,
      type: this.normalizeType(item.type),
      frequency: this.normalizeFrequency(item.frequency),
      status: this.normalizeStatus(item.status)
    };
  }

  private normalizeType(value: TransactionType | string): TransactionType {
    if (typeof value === 'number') return value;
    return value.trim().toLowerCase() === 'income' ? 1 : 2;
  }

  private normalizeFrequency(value: TransactionFrequency | string): TransactionFrequency {
    if (typeof value === 'number') return value;

    switch (value.trim().toLowerCase()) {
      case 'daily': return 1;
      case 'weekly': return 2;
      case 'monthly': return 3;
      case 'yearly': return 4;
      default: return 1;
    }
  }

  private normalizeStatus(value: TransactionStatus | string): TransactionStatus {
    if (typeof value === 'number') return value;
    return value.trim().toLowerCase() === 'cleared' ? 2 : 1;
  }
}
