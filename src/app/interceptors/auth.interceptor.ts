import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router);

    const token = localStorage.getItem('authToken');

    console.log('Auth Interceptor Called');
    console.log('Request URL:', req.url);
    console.log('Token exists:', !!token);


    // ==========================================
    // NO TOKEN
    // ==========================================

    if (!token) {

        return next(req);

    }


    // ==========================================
    // ADD JWT TOKEN
    // ==========================================

    const authReq = req.clone({

        setHeaders: {

            Authorization: `Bearer ${token}`

        }

    });

    console.log('Authorization header added');


    // ==========================================
    // SEND REQUEST
    // ==========================================

    return next(authReq).pipe(

        catchError(error => {

            console.error(
                'HTTP Error:',
                error.status,
                error.url
            );


            // ======================================
            // TOKEN EXPIRED / INVALID
            // ======================================

            if (error.status === 401) {

                console.warn(
                    'JWT expired or invalid. Logging out.'
                );


                // ====================================
                // CLEAR AUTH DATA
                // ====================================

                localStorage.removeItem('authToken');

                localStorage.removeItem('user');

                localStorage.removeItem('userData');

                localStorage.removeItem('currentUser');


                // ====================================
                // REDIRECT TO LOGIN
                // ====================================

                router.navigate(
                    ['/login'],
                    {
                        queryParams: {
                            sessionExpired: 'true'
                        }
                    }
                );

            }


            return throwError(
                () => error
            );

        })

    );

};