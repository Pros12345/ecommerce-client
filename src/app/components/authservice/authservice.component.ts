import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly adminEmailKeyword =
        'prosenjitchakrabortty';

    // =====================================================
    // LOGIN CHECK
    // =====================================================

    isLoggedIn(): boolean {

        return !!localStorage.getItem(
            'authToken'
        );
    }

    // =====================================================
    // PROSENJIT ADMIN EMAIL CHECK
    // =====================================================

    isProsenjitEmail(): boolean {

        const email =
            (
                localStorage.getItem(
                    'userEmail'
                ) || ''
            )
                .trim()
                .toLowerCase();

        return email.includes(
            this.adminEmailKeyword
        );
    }

    // =====================================================
    // LOGOUT
    // =====================================================

    logout(): void {

        localStorage.removeItem(
            'authToken'
        );

        localStorage.removeItem(
            'userEmail'
        );

        localStorage.removeItem(
            'loginIdentifier'
        );

        localStorage.removeItem(
            'userName'
        );
    }
}
