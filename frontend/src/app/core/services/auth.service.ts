import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, Owner } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | Owner | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private apiUrl = `${environment.apiUrl}/auth`;

  private getStoredUser(): User | Owner | null {
    const userStr = localStorage.getItem('rk_user');
    if (userStr) {
      try { return JSON.parse(userStr); } catch (e) { return null; }
    }
    return null;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        if (res.token && res.user) {
          localStorage.setItem('rk_token', res.token);
          localStorage.setItem('rk_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.token && res.user) {
          localStorage.setItem('rk_token', res.token);
          localStorage.setItem('rk_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  registerOwner(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/owner/register`, data).pipe(
      tap((res: any) => {
        if (res.token && res.owner) {
          localStorage.setItem('rk_token', res.token);
          localStorage.setItem('rk_user', JSON.stringify(res.owner));
          this.currentUserSubject.next(res.owner);
        }
      })
    );
  }

  loginOwner(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/owner/login`, data).pipe(
      tap((res: any) => {
        if (res.token && res.owner) {
          localStorage.setItem('rk_token', res.token);
          localStorage.setItem('rk_user', JSON.stringify(res.owner));
          this.currentUserSubject.next(res.owner);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('rk_token');
    localStorage.removeItem('rk_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('rk_token');
  }

  getCurrentUser(): User | Owner | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isOwner(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'OWNER';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'USER';
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`).pipe(
      tap((res: any) => {
        if (res.user) {
          localStorage.setItem('rk_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }
}
