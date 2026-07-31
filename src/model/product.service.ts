import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private url = "http://localhost:8080/api/productsDisplay";

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {

        return this.http.get<Product[]>(this.url);

    }

}