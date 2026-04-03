import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = this.getApiBaseUrl();
    console.log('🔍 API Configuration:', {
      environment: environment.production ? 'production' : 'development',
      hostname: window.location.hostname,
      finalApiUrl: this.apiUrl
    });
  }

  private getApiBaseUrl(): string {
    return environment.apiUrl;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const publicEndpoints = ['/auth/register/', '/auth/login/', '/auth/refresh/'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (!isPublicEndpoint) {
      // Prefer the new token key; fall back to legacy key
      const token = localStorage.getItem('accounteezy_token') || localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        const cleanToken = token.trim();
        const authToken = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;

        req = req.clone({
          setHeaders: {
            Authorization: authToken
          }
        });
      }
    }

    return next.handle(req);
  }
}
