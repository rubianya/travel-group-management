import { Injectable } from "@angular/core";
import { Group, TripGroupRequestDTO } from "../models/group.model";
import { Observable } from "rxjs";
import { environment } from "../../../enviroment/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Registration } from "../models/registration.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl = environment.apiUrl + "/trips/groups";

  constructor(private http: HttpClient) { }

  // สร้างกลุ่มอัตโนมัติ
  autoGrouping(tripId: number, groupSize: number = 4): Observable<Group[]> {
    let params = new HttpParams().set('groupSize', groupSize);
    return this.http.post<Group[]>(`${this.apiUrl}/${tripId}/auto-grouping`, {}, { params });
  }

  // ดึงข้อมูลกลุ่มทั้งหมดตาม Trip ID
  getGroupsByTripId(tripId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/${tripId}/groups`);
  }

  // สร้างกลุ่มใหม่ด้วยตนเอง
  createGroup(tripId: number, dto: TripGroupRequestDTO): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/${tripId}/groups`, dto);
  }

  // แก้ไขกลุ่ม
  updateGroup(groupId: number, dto: TripGroupRequestDTO): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${groupId}`, dto);
  }

  // ลบกลุ่ม
  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}`);
  }

  // เพิ่มสมาชิกเข้ากลุ่ม
  addMemberToGroup(groupId: number, registrationId: number): Observable<Group> {
    let params = new HttpParams().set('registrationId', registrationId);
    return this.http.post<Group>(`${this.apiUrl}/${groupId}/members`, {}, { params });
  }

  // ลบสมาชิกออกจากกลุ่ม
  removeMemberFromGroup(groupId: number, registrationId: number): Observable<Group> {
    return this.http.delete<Group>(`${this.apiUrl}/${groupId}/members/${registrationId}`);
  }

  // ยืนยันการจัดกลุ่ม
  confirmGroup(groupId: number, status?: string): Observable<Group> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.patch<Group>(`${this.apiUrl}/groups/${groupId}/confirm`, {}, { params });
  }

  // ดึงข้อมูลสมาชิกที่ยังไม่ถูกจัดกลุ่ม
  getUnassignedMembers(tripId: number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}/${tripId}/unassigned-members`);
  }

}