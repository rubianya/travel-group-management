import { inject, Injectable } from "@angular/core";
import { Registration } from "../models/registration.model";
import { Observable, of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/environment';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    private apiUrl = environment.apiUrl + "/registrations";
    private http = inject(HttpClient);

    // สร้างใบสมัครใหม่
    registerTrip(): Observable<Registration[]> {
        return this.http.get<Registration[]>(this.apiUrl);
    }

    // ดึงรายการลงทะเบียนทั้งหมด
    getAllRegistrations(): Observable<Registration[]> {
        return this.http.get<Registration[]>(this.apiUrl);
    }

    // ดึงรายการลงทะเบียนตาม Registration ID
    getRegistrationById(id: number): Observable<Registration> {
        return this.http.get<Registration>(this.apiUrl + "/" + id);
    }

    // ดึงรายการลงทะเบียนตาม Trip ID
    getRegistrationsByTripId(trip: number): Observable<Registration[]> {
        return this.http.get<Registration[]>(this.apiUrl + "/" + trip + "/registrations");
    }

    // ดึงรายการลงทะเบียนตาม User ID
    getRegistrationsByUserId(user: number): Observable<Registration[]> {
        return this.http.get<Registration[]>(this.apiUrl + "/" + user + "/registrations");
    }

    // อัปเดตใบสมัคร
    updateRegistration(id: number, registration: Registration): Observable<Registration> {
        return this.http.put<Registration>(`${this.apiUrl}/${id}`, registration);
    }

    // อัปเดตสถานะ
    updateStatus(id: number, status: string): Observable<Registration> {
        return this.http.patch<Registration>(`${this.apiUrl}/${id}/status`, { status });
    }

    // ลบใบสมัคร
    deleteRegistration(id: number): Observable<Registration> {
        return this.http.delete<Registration>(`${this.apiUrl}/${id}`);
    }

}