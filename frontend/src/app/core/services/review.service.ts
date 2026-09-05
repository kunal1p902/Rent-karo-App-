import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  createReview(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getVehicleReviews(vehicleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicle/${vehicleId}`);
  }
}
