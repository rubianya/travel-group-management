import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../enviroment/environment";
import { Observable } from "rxjs";
import { UserResponseDTO, UserRequestDTO } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCurrentProfile(): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/users/profile`);
    }

    getAllUsers(): Observable<UserResponseDTO[]> {
        return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/users`);
    }

    getUserById(id: number): Observable<UserResponseDTO> {
        return this.http.get<UserResponseDTO>(`${this.apiUrl}/users/${id}`);
    }

    getUserByRole(role: string): Observable<UserResponseDTO[]> {
        return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/users/role/${role}`);
    }

    saveUser(user: UserRequestDTO): Observable<UserResponseDTO> {
        return this.http.post<UserResponseDTO>(`${this.apiUrl}/users`, user);
    }

    updateUser(id: number, user: UserRequestDTO): Observable<UserResponseDTO> {
        return this.http.put<UserResponseDTO>(`${this.apiUrl}/users/${id}`, user);
    }

    toggleStatus(id: number, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/users/${id}/status`, { status });
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
    }

}