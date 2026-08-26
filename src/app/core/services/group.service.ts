import { Injectable } from "@angular/core";
import { TripGroupResponseDTO, TripGroupRequestDTO } from "../models/group.model";
import { Observable } from "rxjs";
import { environment } from "../../../enviroment/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { TripRegistrationResponseDTO } from "../models/registration.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl = environment.apiUrl + "/trips/groups";

  constructor(private http: HttpClient) { }

  // สร้างกลุ่มอัตโนมัติ
  autoGrouping(tripId: number, groupSize: number = 4): Observable<TripGroupResponseDTO[]> {
    let params = new HttpParams().set('groupSize', groupSize);
    return this.http.post<TripGroupResponseDTO[]>(`${this.apiUrl}/${tripId}/auto-grouping`, {}, { params });
  }

  // ดึงข้อมูลกลุ่มทั้งหมดตาม Trip ID
  getGroupsByTripId(tripId: number): Observable<TripGroupResponseDTO[]> {
    return this.http.get<TripGroupResponseDTO[]>(`${this.apiUrl}/${tripId}/groups`);
  }

  // สร้างกลุ่มใหม่ด้วยตนเอง
  createGroup(tripId: number, dto: TripGroupRequestDTO): Observable<TripGroupResponseDTO> {
    return this.http.post<TripGroupResponseDTO>(`${this.apiUrl}/${tripId}/groups`, dto);
  }

  // แก้ไขกลุ่ม
  updateGroup(groupId: number, dto: TripGroupRequestDTO): Observable<TripGroupResponseDTO> {
    return this.http.put<TripGroupResponseDTO>(`${this.apiUrl}/${groupId}`, dto);
  }

  // ลบกลุ่ม
  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}`);
  }

  // เพิ่มสมาชิกเข้ากลุ่ม
  addMemberToGroup(groupId: number, registrationId: number): Observable<TripGroupResponseDTO> {
    let params = new HttpParams().set('registrationId', registrationId);
    return this.http.post<TripGroupResponseDTO>(`${this.apiUrl}/${groupId}/members`, {}, { params });
  }

  // ลบสมาชิกออกจากกลุ่ม
  removeMemberFromGroup(groupId: number, registrationId: number): Observable<TripGroupResponseDTO> {
    return this.http.delete<TripGroupResponseDTO>(`${this.apiUrl}/${groupId}/members/${registrationId}`);
  }

  // ยืนยันการจัดกลุ่ม
  confirmGroup(groupId: number, status?: string): Observable<TripGroupResponseDTO> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.patch<TripGroupResponseDTO>(`${this.apiUrl}/${groupId}/confirm`, {}, { params });
  }

  // ดึงข้อมูลสมาชิกที่ยังไม่ถูกจัดกลุ่ม
  getUnassignedMembers(tripId: number): Observable<TripRegistrationResponseDTO[]> {
    return this.http.get<TripRegistrationResponseDTO[]>(`${this.apiUrl}/${tripId}/unassigned-members`);
  }

}