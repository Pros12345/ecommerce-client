import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn(): boolean {
        return !!localStorage.getItem('authToken'); // true if token exists
    }

    logout(): void {
        localStorage.removeItem('authToken');
    }
}
