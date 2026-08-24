import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiBaseUrl}/user`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/profile`,
      profileData
    );
  }

  changePassword(
    passwordData: any
  ): Observable<MessageResponse> {

    return this.http.put<MessageResponse>(
      `${this.apiUrl}/change-password`,
      passwordData
    );
  }
}