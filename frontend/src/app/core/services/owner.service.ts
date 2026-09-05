import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/owner`;

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getOwnerEarnings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/earnings`);
  }

  updateProfile(formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, formData);
  }
}
