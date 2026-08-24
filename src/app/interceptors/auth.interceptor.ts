import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('authToken');

    console.log('Auth Interceptor Called');
    console.log('Request URL:', req.url);
    console.log('Token exists:', !!token);

    if (token) {

        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Authorization header added');

        return next(authReq);
    }

    return next(req);
};