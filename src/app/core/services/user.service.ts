import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../enviroment/environment";
import { Observable } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCurrentProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/profile`);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    }

    getUserByRole(role: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users/role/${role}`);
    }

    saveUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, user);
    }

    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
    }

    toggleStatus(id: number, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/users/${id}/status`, { status });
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
    }

}