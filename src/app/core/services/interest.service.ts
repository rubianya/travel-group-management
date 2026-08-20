import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Interest, InterestRequest } from '../models/interest.model';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private apiUrl = environment.apiUrl + "/travel-interests";

  constructor(private http: HttpClient) { }

  getAllInterests(): Observable<Interest[]> {
    return this.http.get<Interest[]>(this.apiUrl);
  }

  createInterest(interest: InterestRequest): Observable<Interest> {
    return this.http.post<Interest>(this.apiUrl, interest);
  }

  getInterestById(id: number): Observable<Interest> {
    return this.http.get<Interest>(`${this.apiUrl}/${id}`);
  }

  updateInterest(id: number, interest: InterestRequest): Observable<Interest> {
    return this.http.put<Interest>(`${this.apiUrl}/${id}`, interest);
  }

  deleteInterest(id: number): Observable<Interest> {
    return this.http.delete<Interest>(`${this.apiUrl}/${id}`);
  }

}
