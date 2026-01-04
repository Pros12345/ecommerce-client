import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '${environment.apiBaseUrl}/api/auth/register'; // Change this if your backend URL is different

    constructor(private http: HttpClient) { }

    registerUser(userData: any): Observable<any> {
        return this.http.post(this.apiUrl, userData);
    }
}
