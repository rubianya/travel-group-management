import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = '/api/trips'; 

  private mockTrips: Trip[] = [
    { id: 1, name: 'ทริปเชียงใหม่ สายคาเฟ่', location: 'เชียงใหม่', startDate: '2024-11-01', endDate: '2024-11-03', maxParticipants: 10, groupSize: 4, budget: 1500, category: 'คาเฟ่', status: 'OPEN' },
    { id: 2, name: 'ดำน้ำดูปะการัง เกาะเต่า', location: 'สุราษฎร์ธานี', startDate: '2024-12-10', endDate: '2024-12-12', maxParticipants: 20, groupSize: 5, budget: 3500, category: 'ทะเล', status: 'DRAFT' },
    { id: 3, name: 'ไหว้พระอยุธยา', location: 'อยุธยา', startDate: '2024-10-25', endDate: '2024-10-25', maxParticipants: 15, groupSize: 3, budget: 500, category: 'วัฒนธรรม', status: 'CLOSED' }
  ];

  constructor(private http: HttpClient) {}

  // 1. GET /api/trips (ดึงข้อมูลทริปทั้งหมด)
  getTrips(): Observable<Trip[]> {
    // โค้ดจริงเมื่อต่อ API: return this.http.get<Trip[]>(this.apiUrl);
    return of(this.mockTrips); // ใช้ Mock Data ไปก่อน
  }

  // 2. GET /api/trips/{id} (ดึงข้อมูลทริปตาม ID)
  getTripById(id: number): Observable<Trip | undefined> {
    // โค้ดจริง: return this.http.get<Trip>(`${this.apiUrl}/${id}`);
    const trip = this.mockTrips.find(t => t.id === id);
    return of(trip);
  }

  // 3. POST /api/trips (สร้างทริปใหม่)
  createTrip(trip: Trip): Observable<Trip> {
    // โค้ดจริง: return this.http.post<Trip>(this.apiUrl, trip);
    const newTrip = { ...trip, id: this.mockTrips.length + 1 };
    this.mockTrips.push(newTrip); // จำลองการเซฟลง Mock Data
    return of(newTrip);
  }

  // 4. PUT /api/trips/{id} (แก้ไขทริป)
  updateTrip(id: number, trip: Trip): Observable<Trip> {
    // โค้ดจริง: return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip);
    const index = this.mockTrips.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTrips[index] = { ...trip, id };
    }
    return of(this.mockTrips[index]);
  }

  // 5. DELETE /api/trips/{id} (ลบทริป)
  deleteTrip(id: number): Observable<void> {
    // โค้ดจริง: return this.http.delete<void>(`${this.apiUrl}/${id}`);
    this.mockTrips = this.mockTrips.filter(t => t.id !== id);
    return of(undefined);
  }
}