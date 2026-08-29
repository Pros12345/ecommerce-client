import { inject } from '@angular/core';

import {
    CanActivateFn,
    Router
} from '@angular/router';

import { AuthService } from '../components/authservice/authservice.component';

export const adminGuard: CanActivateFn = () => {

    const authService =
        inject(AuthService);

    const router =
        inject(Router);

    // =====================================================
    // FIRST CHECK LOGIN
    // =====================================================

    if (!authService.isLoggedIn()) {

        return router.createUrlTree([
            '/login'
        ]);
    }

    // =====================================================
    // ADMIN EMAIL CHECK
    // =====================================================

    if (!authService.isProsenjitEmail()) {

        return router.createUrlTree([
            '/home'
        ]);
    }

    // =====================================================
    // ADMIN USER
    // =====================================================

    return true;
};
