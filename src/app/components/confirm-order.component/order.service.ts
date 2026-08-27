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
// ORDER ITEM RESPONSE
// ==========================================

export interface OrderItemResponse {

    productId: number;

    productName: string;

    quantity: number;

    price: number;

    total: number;

    imageId?: number;

    image?: string;
}


// ==========================================
// ADDRESS RESPONSE
// ==========================================

export interface OrderAddressResponse {

    id?: number;

    fullName: string;

    mobileNumber: string;

    addressLine1: string;

    addressLine2?: string;

    city: string;

    state: string;

    pincode: string;

    landmark?: string;

    addressType: string;

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

    address: OrderAddressResponse;

    items: OrderItemResponse[];

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


    // ==========================================
    // GET MY ORDERS
    // ==========================================

    getMyOrders(): Observable<OrderResponse[]> {

        return this.http.get<OrderResponse[]>(
            `${this.apiUrl}/my-orders`
        );

    }


    // ==========================================
    // CANCEL ORDER
    // ==========================================

    cancelOrder(
        orderId: number
    ): Observable<OrderResponse> {

        return this.http.put<OrderResponse>(
            `${this.apiUrl}/${orderId}/cancel`,
            {}
        );

    }


    // ==========================================
    // MARK ORDER ON THE WAY
    // ==========================================

    markOrderOnTheWay(
        orderId: number
    ): Observable<OrderResponse> {

        return this.http.put<OrderResponse>(
            `${this.apiUrl}/${orderId}/on-the-way`,
            {}
        );

    }


    // ==========================================
    // DELETE CANCELLED ORDER
    // ==========================================

    deleteOrder(
        orderId: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${orderId}`
        );

    }

}