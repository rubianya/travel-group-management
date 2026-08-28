import { inject, Injectable } from "@angular/core";
import { TripRegistrationResponseDTO, TripRegistrationRequestDTO } from "../models/registration.model";
import { ApiResponse } from "../models/api_response.model";
import { Observable, map } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/environment';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    private apiUrl = environment.apiUrl + "/registrations";
    private http = inject(HttpClient);

    // สร้างใบลงทะเบียนเข้าร่วมทริป
    registerTrip(tripId: number, dto: TripRegistrationRequestDTO): Observable<TripRegistrationResponseDTO> {
        return this.http.post<ApiResponse<TripRegistrationResponseDTO>>(`${this.apiUrl}/${tripId}`, dto)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนทั้งหมด
    getAllRegistrations(): Observable<TripRegistrationResponseDTO[]> {
        return this.http.get<ApiResponse<TripRegistrationResponseDTO[]>>(this.apiUrl)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนตาม Registration ID
    getRegistrationById(id: number): Observable<TripRegistrationResponseDTO> {
        return this.http.get<ApiResponse<TripRegistrationResponseDTO>>(this.apiUrl + "/" + id)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนตาม Trip ID สำหรับ Organizer
    getRegistrationsByTripId(tripId: number): Observable<TripRegistrationResponseDTO[]> {
        return this.http.get<ApiResponse<TripRegistrationResponseDTO[]>>(this.apiUrl + "/trip/" + tripId)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนตาม User ID สำหรับ Traveler
    getRegistrationsByUserId(userId: number): Observable<TripRegistrationResponseDTO[]> {
        return this.http.get<ApiResponse<TripRegistrationResponseDTO[]>>(this.apiUrl + "/user/" + userId)
            .pipe(map(res => res.data));
    }

    // อัปเดตใบสมัครลงทะเบียน
    updateRegistration(id: number, dto: TripRegistrationRequestDTO): Observable<TripRegistrationResponseDTO> {
        return this.http.put<ApiResponse<TripRegistrationResponseDTO>>(`${this.apiUrl}/${id}`, dto)
            .pipe(map(res => res.data));
    }

    // อัปเดตสถานะ
    updateStatus(id: number, status: string): Observable<TripRegistrationResponseDTO> {
        return this.http.patch<ApiResponse<TripRegistrationResponseDTO>>(`${this.apiUrl}/${id}/status`, { status })
            .pipe(map(res => res.data));
    }

    // ลบใบสมัคร ลบจริงอันตราย
    deleteRegistration(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
            .pipe(map(res => res.data));
    }

}