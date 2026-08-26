import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


// ==========================================
// ORDER ITEM REQUEST
// ==========================================

export interface OrderItemRequest {

    productId: number;

    quantity: number;

}


// ==========================================
// ORDER REQUEST
// ==========================================

export interface OrderRequest {

    addressId: number;

    paymentMethod: string;

    items: OrderItemRequest[];

}


// ==========================================
// ORDER RESPONSE
// ==========================================

export interface OrderResponse {

    orderId: number;

    totalAmount: number;

    paymentMethod: string;

    orderStatus: string;

    orderDate: string;

    address: any;

    items: any[];

}


// ==========================================
// SERVICE
// ==========================================

@Injectable({
    providedIn: 'root'
})
export class OrderService {


    private apiUrl =
        `${environment.apiBaseUrl}/orders`;


    constructor(
        private http: HttpClient
    ) { }


    // ==========================================
    // PLACE ORDER
    // ==========================================

    placeOrder(
        orderRequest: OrderRequest
    ): Observable<OrderResponse> {

        return this.http.post<OrderResponse>(
            this.apiUrl,
            orderRequest
        );

    }

}