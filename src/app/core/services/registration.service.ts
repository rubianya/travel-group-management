import { inject, Injectable } from "@angular/core";
import { Registration, RegistrationRequest } from "../models/registration.model";
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
    registerTrip(dto: RegistrationRequest): Observable<Registration> {
        return this.http.post<ApiResponse<Registration>>(this.apiUrl, dto)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนทั้งหมด
    getAllRegistrations(): Observable<Registration[]> {
        return this.http.get<ApiResponse<Registration[]>>(this.apiUrl)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนตาม Registration ID
    getRegistrationById(id: number): Observable<Registration> {
        return this.http.get<ApiResponse<Registration>>(this.apiUrl + "/" + id)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนตาม Trip ID สำหรับ Organizer
    getRegistrationsByTripId(tripId: number): Observable<Registration[]> {
        return this.http.get<ApiResponse<Registration[]>>(this.apiUrl + "/trip/" + tripId)
            .pipe(map(res => res.data));
    }

    // ดึงรายการลงทะเบียนตาม User ID สำหรับ Traveler
    getRegistrationsByUserId(userId: number): Observable<Registration[]> {
        return this.http.get<ApiResponse<Registration[]>>(this.apiUrl + "/user/" + userId)
            .pipe(map(res => res.data));
    }

    // อัปเดตใบสมัครลงทะเบียน
    updateRegistration(id: number, dto: RegistrationRequest): Observable<Registration> {
        return this.http.put<ApiResponse<Registration>>(`${this.apiUrl}/${id}`, dto)
            .pipe(map(res => res.data));
    }

    // อัปเดตสถานะ
    updateStatus(id: number, status: string): Observable<Registration> {
        return this.http.patch<ApiResponse<Registration>>(`${this.apiUrl}/${id}/status`, { status })
            .pipe(map(res => res.data));
    }

    // ลบใบสมัคร
    deleteRegistration(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
            .pipe(map(res => res.data));
    }

}