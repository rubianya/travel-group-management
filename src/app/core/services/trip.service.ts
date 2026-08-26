import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripResponseDTO, TripRequestDTO } from '../models/trip.model';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = environment.apiUrl + "/trips";

  constructor(private http: HttpClient) { }

  // ดึงข้อมูลทริปทั้งหมด
  getAllTrips(): Observable<TripResponseDTO[]> {
    return this.http.get<TripResponseDTO[]>(this.apiUrl);
  }

  // ดึงข้อมูลทริปของฉัน
  getMyTrips(): Observable<TripResponseDTO[]> {
    return this.http.get<TripResponseDTO[]>(`${this.apiUrl}/my-trips`);
  }

  // ดึงข้อมูลทริปตาม ID
  getTripById(id: number): Observable<TripResponseDTO | undefined> {
    return this.http.get<TripResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // สร้างทริปใหม่
  createTrip(trip: TripRequestDTO, file?: File | null): Observable<TripResponseDTO> {
    const formData = new FormData();
    formData.append('trip', new Blob([JSON.stringify(trip)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<TripResponseDTO>(this.apiUrl, formData);
  }

  // แก้ไขทริป
  updateTrip(id: number, trip: TripRequestDTO, file?: File | null): Observable<TripResponseDTO> {
    const formData = new FormData();
    formData.append('trip', new Blob([JSON.stringify(trip)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<TripResponseDTO>(`${this.apiUrl}/${id}`, formData);
  }

  // ลบทริป **อันตรายลบข้อมูลจริง**
  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // เปลี่ยนสถานะทริป
  updateTripStatus(id: number, status: string): Observable<TripResponseDTO> {
    return this.http.patch<TripResponseDTO>(`${this.apiUrl}/${id}/status`, { status });
  }
}