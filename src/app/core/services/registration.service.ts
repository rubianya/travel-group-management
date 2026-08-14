import { Injectable } from "@angular/core";
import { Registration } from "../models/registration.model";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    // ข้อมูลจำลอง (Mock Data) ระหว่างรอ Backend
    private mockRegistrations: Registration[] = [
        {
            id: 1,
            tripId: 1,
            travelerName: 'สมชาย สายแคมป์',
            budget: 2000,
            interests: ['ธรรมชาติ', 'เดินป่า'],
            status: 'PAID',
            remark: 'แพ้อาหารทะเล'
        },
        {
            id: 2,
            tripId: 1,
            travelerName: 'สมหญิง รักสบาย',
            budget: 5000,
            interests: ['คาเฟ่', 'ถ่ายรูป'],
            status: 'CONFIRMED'
        },
        {
            id: 3,
            tripId: 2,
            travelerName: 'สมหมาย สายช้อป',
            budget: 10000,
            interests: ['ช้อปปิ้ง', 'อาหารท้องถิ่น'],
            status: 'WAITING_PAYMENT',
            remark: 'ขอที่พักใกล้ตลาด'
        }
    ];

    // ดึงข้อมูลการสมัครทั้งหมด
    getRegistrations(): Observable<Registration[]> {
        return of(this.mockRegistrations);
    }

    // สร้างใบสมัครใหม่
    createRegistration(registration: Registration): Observable<Registration> {
        const newReg = { ...registration, id: this.mockRegistrations.length + 1 };
        this.mockRegistrations.push(newReg);
        return of(newReg);
    }

    // อัปเดตสถานะการสมัคร (ตาม Requirement ที่ Organizer เปลี่ยนสถานะได้)
    updateStatus(id: number, newStatus: Registration['status']): Observable<Registration | undefined> {
        const index = this.mockRegistrations.findIndex(r => r.id === id);
        if (index !== -1) {
            this.mockRegistrations[index].status = newStatus;
            return of(this.mockRegistrations[index]);
        }
        return of(undefined);
    }
}