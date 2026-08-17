import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Trip } from '../models/trip.model';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = environment.apiUrl + "/trips";

  constructor(private http: HttpClient) { }

  // ดึงข้อมูลทริปทั้งหมด
  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  // ดึงข้อมูลทริปของฉัน
  getMyTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/my-trips`);
  }

  // ดึงข้อมูลทริปตาม ID
  getTripById(id: number): Observable<Trip | undefined> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  // สร้างทริปใหม่
  createTrip(trip: Trip, file?: File | null): Observable<Trip> {
    const formData = new FormData();
    formData.append('trip', new Blob([JSON.stringify(trip)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Trip>(this.apiUrl, formData);
  }

  // แก้ไขทริป
  updateTrip(id: number, trip: Trip, file?: File | null): Observable<Trip> {
    const formData = new FormData();
    formData.append('trip', new Blob([JSON.stringify(trip)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, formData);
  }

  // ลบทริป **อันตรายลบข้อมูลจริง**
  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // เปลี่ยนสถานะทริป
  updateTripStatus(id: number, status: string): Observable<Trip> {
    return this.http.patch<Trip>(`${this.apiUrl}/${id}/status`, { status });
  }
}