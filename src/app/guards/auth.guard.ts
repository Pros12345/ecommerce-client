import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../components/authservice/authservice.component';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        console.log('Redirecting to login...');
        return router.createUrlTree(['/login']);
    }

    return true;
};