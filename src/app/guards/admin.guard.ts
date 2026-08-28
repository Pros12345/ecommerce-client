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

        console.log(
            'User is not logged in.'
        );

        return router.createUrlTree([
            '/login'
        ]);
    }

    // =====================================================
    // ADMIN EMAIL CHECK
    // =====================================================

    if (!authService.isProsenjitEmail()) {

        console.log(
            'User is not authorized for admin page.'
        );

        return router.createUrlTree([
            '/home'
        ]);
    }

    // =====================================================
    // ADMIN USER
    // =====================================================

    return true;
};
