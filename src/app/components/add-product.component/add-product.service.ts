import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private baseUrl = `${environment.apiBaseUrl}/api/products`;

    constructor(private http: HttpClient) { }

    addProduct(productData: any, image: File): Observable<any> {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        formData.append('image', image);

        return this.http.post(this.baseUrl, formData);
    }
}
