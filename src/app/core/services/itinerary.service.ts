import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Itinerary } from '../models/itinerary.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  // จำลองข้อมูลกำหนดการเดินทางของ ทริป ID = 1
  private mockItineraries: Itinerary[] = [
    { id: 1, tripId: 1, dayNo: 1, time: '08:00', title: 'รวมตัวที่จุดนัดพบ', location: 'สนามบินดอนเมือง' },
    { id: 2, tripId: 1, dayNo: 1, time: '10:30', title: 'เดินทางถึงเชียงใหม่ & แวะคาเฟ่สไตล์มินิมอล', location: 'ตัวเมืองเชียงใหม่' },
    { id: 3, tripId: 1, dayNo: 2, time: '09:00', title: 'เดินชมธรรมชาติและถ่ายรูป', location: 'ม่อนแจ่ม' },
    { id: 4, tripId: 1, dayNo: 2, time: '18:00', title: 'รับประทานอาหารเย็น (อาหารท้องถิ่น)', location: 'ร้านอาหารพื้นเมือง' }
  ];

  getItinerariesByTripId(tripId: number): Observable<Itinerary[]> {
    const data = this.mockItineraries.filter(item => item.tripId === tripId);
    return of(data);
  }
}