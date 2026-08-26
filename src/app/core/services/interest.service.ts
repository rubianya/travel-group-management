import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TravelInterestResponseDTO, TravelInterestRequestDTO } from '../models/interest.model';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private apiUrl = environment.apiUrl + "/travel-interests";

  constructor(private http: HttpClient) { }

  getAllInterests(): Observable<TravelInterestResponseDTO[]> {
    return this.http.get<TravelInterestResponseDTO[]>(this.apiUrl);
  }

  createInterest(interest: TravelInterestRequestDTO): Observable<TravelInterestResponseDTO> {
    return this.http.post<TravelInterestResponseDTO>(this.apiUrl, interest);
  }

  getInterestById(id: number): Observable<TravelInterestResponseDTO> {
    return this.http.get<TravelInterestResponseDTO>(`${this.apiUrl}/${id}`);
  }

  updateInterest(id: number, interest: TravelInterestRequestDTO): Observable<TravelInterestResponseDTO> {
    return this.http.put<TravelInterestResponseDTO>(`${this.apiUrl}/${id}`, interest);
  }

  deleteInterest(id: number): Observable<TravelInterestResponseDTO> {
    return this.http.delete<TravelInterestResponseDTO>(`${this.apiUrl}/${id}`);
  }

}
