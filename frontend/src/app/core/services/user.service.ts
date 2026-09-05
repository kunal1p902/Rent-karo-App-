import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, formData);
  }

  getWishlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wishlist`);
  }

  toggleWishlist(vehicleId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/wishlist/${vehicleId}`, {});
  }
}
