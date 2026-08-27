import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('authToken');

    console.log('Auth Interceptor Called');
    console.log('Request URL:', req.url);
    console.log('Token exists:', !!token);

    if (!token) {
        console.log('No token found');
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
                error.message
            );

            // DO NOT clear token on 403 while debugging

            return throwError(() => error);
        })
    );
};