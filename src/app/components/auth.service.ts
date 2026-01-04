import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../config';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${APP_CONFIG.API_BASE_URL}/api/auth/register`;

    constructor(private http: HttpClient) { }

    registerUser(userData: any): Observable<any> {
        return this.http.post(this.apiUrl, userData);
    }
}
