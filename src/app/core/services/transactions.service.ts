import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TransactionItem, TransactionRequest } from '../models/transaction.models';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly apiUrl = 'http://localhost:5071/api/transactions';

  /** Emits whenever a transaction is created or deleted — lets other components react in real-time */
  private readonly _changed$ = new Subject<void>();
  readonly changed$ = this._changed$.asObservable();

  markChanged(): void { this._changed$.next(); }

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<TransactionItem[]>(this.apiUrl);
  }

  create(payload: TransactionRequest) {
    return this.http.post<TransactionItem>(this.apiUrl, payload);
  }

  update(id: number, payload: TransactionRequest) {
    return this.http.put<TransactionItem>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
