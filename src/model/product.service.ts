import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private url = `${environment.apiBaseUrl}/productsDisplay`;

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {

        return this.http.get<Product[]>(this.url);

    }

    deleteProduct(id: number) {

        return this.http.delete(
            `${environment.apiBaseUrl}/products/${id}`,
            { responseType: 'text' }
        );
    }
}