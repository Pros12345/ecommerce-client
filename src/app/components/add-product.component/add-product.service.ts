import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../config';
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private baseUrl = `${APP_CONFIG.API_BASE_URL}/api/products`;

    constructor(private http: HttpClient) { }

    addProduct(productData: any, image: File): Observable<any> {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        formData.append('image', image);

        return this.http.post(this.baseUrl, formData);
    }
}
