import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api_response.model';
import { TripStatDTO, ApplicantStatDTO, UpcomingTripDTO } from '../models/dashboard.model';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  getTripStats(): Observable<ApiResponse<TripStatDTO>> {
    return this.http.get<ApiResponse<TripStatDTO>>(`${this.apiUrl}/trips-stat`);
  }

  getApplicantStatsByTripId(tripId: number): Observable<ApiResponse<ApplicantStatDTO>> {
    return this.http.get<ApiResponse<ApplicantStatDTO>>(`${this.apiUrl}/applicants-stat/${tripId}`);
  }

  getGroupCountByTripId(tripId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/groups-count/${tripId}`);
  }

  getUnassignedMembersCountByTripId(tripId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/unassigned-members-count/${tripId}`);
  }

  getUpcomingTripsByUserId(userId: number): Observable<ApiResponse<UpcomingTripDTO[]>> {
    return this.http.get<ApiResponse<UpcomingTripDTO[]>>(`${this.apiUrl}/upcoming-trips/user/${userId}`);
  }
}
