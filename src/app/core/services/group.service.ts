import { Injectable } from "@angular/core";
import { Group } from "../models/group.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
    private mockGroups: Group[] = [
    {
      id: 1,
      tripId: 1, // ทริปเชียงใหม่
      groupName: 'กลุ่ม 1 (สายคาเฟ่-ถ่ายรูป)',
      members: [
        { registrationId: 2, travelerName: 'สมหญิง รักสบาย', interests: ['คาเฟ่', 'ถ่ายรูป'] }
      ]
    }
  ];

  // ดึงข้อมูลกลุ่มทั้งหมดตาม Trip ID
  getGroupsByTripId(tripId: number): Observable<Group[]> {
    const groups = this.mockGroups.filter(g => g.tripId === tripId);
    return of(groups);
  }

  getGroupsByUserId(userId: number): Observable<Group[]> {
    // For mock purposes, just return all groups or filter by a dummy condition
    return of(this.mockGroups);
  }

  // จำลองการเรียก API ไปยัง Backend เพื่อทำการจัดกลุ่มอัตโนมัติ
  generateAutoGroups(tripId: number): Observable<Group[]> {
    console.log(`[Mock API] กำลังประมวลผลจัดกลุ่มอัตโนมัติสำหรับ Trip ID: ${tripId}...`);
    
    // ข้อมูลจำลองเมื่อ Backend จัดกลุ่มเสร็จแล้ว
    const newlyGeneratedGroups: Group[] = [
      {
        id: 1,
        tripId: tripId,
        groupName: 'กลุ่ม 1 (สายธรรมชาติ)',
        members: [
          { registrationId: 1, travelerName: 'สมชาย สายแคมป์', interests: ['ธรรมชาติ', 'เดินป่า'] }
        ]
      },
      {
        id: 2,
        tripId: tripId,
        groupName: 'กลุ่ม 2 (สายคาเฟ่)',
        members: [
          { registrationId: 2, travelerName: 'สมหญิง รักสบาย', interests: ['คาเฟ่', 'ถ่ายรูป'] },
          { registrationId: 4, travelerName: 'น้องใจดี มีเวลา', interests: ['คาเฟ่', 'อาหารท้องถิ่น'] }
        ]
      }
    ];

    // อัปเดตข้อมูล Mock
    this.mockGroups = this.mockGroups.filter(g => g.tripId !== tripId).concat(newlyGeneratedGroups);

    // จำลองการหน่วงเวลา (Delay) 1.5 วินาที เพื่อให้เห็นจังหวะ Loading เหมือนต่อ API จริง
    return of(newlyGeneratedGroups);
  }
}