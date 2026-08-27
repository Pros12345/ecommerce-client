import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router);

    const token = localStorage.getItem('authToken');

    console.log('Auth Interceptor Called');
    console.log('Request URL:', req.url);
    console.log('Token exists:', !!token);

    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log('Authorization header added');

    return next(authReq).pipe(

        catchError((error) => {

            console.error(
                'HTTP Error:',
                error.status,
                error
            );

            /*
             * JWT expired / invalid
             */
            if (
                (error.status === 401 || error.status === 403) &&
                !req.url.includes('/auth/login')
            ) {

                console.warn(
                    'Authentication failed. Clearing stored authentication.'
                );

                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('loginIdentifier');
                localStorage.removeItem('userName');

                router.navigate(['/login']);

            }

            return throwError(() => error);
        })
    );
};