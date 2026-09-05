import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  createBooking(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getUserBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my`);
  }

  getOwnerBookings(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get(`${this.apiUrl}/owner`, { params });
  }

  getBooking(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateBookingStatus(id: string, status: string, reason?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status, reason });
  }

  cancelBooking(id: string, reason: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { body: { reason } });
  }
}
