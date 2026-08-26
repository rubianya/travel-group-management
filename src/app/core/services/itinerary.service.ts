import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Itinerary } from '../models/itinerary.model';
import { environment } from '../../../enviroment/environment';
import { ApiResponse } from '../models/api_response.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getItinerariesByTripId(tripId: number): Observable<ApiResponse<Itinerary[]>> {
    return this.http.get<ApiResponse<Itinerary[]>>(`${this.apiUrl}/trips/${tripId}/itineraries`);
  }

  createItinerary(tripId: number, dto: Itinerary): Observable<ApiResponse<Itinerary>> {
    return this.http.post<ApiResponse<Itinerary>>(`${this.apiUrl}/trips/${tripId}/itineraries`, dto);
  }

  updateItinerary(id: number, dto: Itinerary): Observable<ApiResponse<Itinerary>> {
    return this.http.put<ApiResponse<Itinerary>>(`${this.apiUrl}/itineraries/${id}`, dto);
  }

  deleteItinerary(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/itineraries/${id}`);
  }
}