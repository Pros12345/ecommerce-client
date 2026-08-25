import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Address } from './address';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    private apiUrl = `${environment.apiBaseUrl}/user/addresses`;

    constructor(
        private http: HttpClient
    ) { }


    // ==========================================
    // GET ALL SAVED ADDRESSES
    // ==========================================

    getAddresses(): Observable<Address[]> {

        return this.http.get<Address[]>(
            this.apiUrl
        );

    }


    // ==========================================
    // GET ADDRESS BY ID
    // ==========================================

    getAddressById(
        id: number
    ): Observable<Address> {

        return this.http.get<Address>(
            `${this.apiUrl}/${id}`
        );

    }


    // ==========================================
    // ADD NEW ADDRESS
    // ==========================================

    addAddress(
        address: Address
    ): Observable<Address> {

        return this.http.post<Address>(
            this.apiUrl,
            address
        );

    }


    // ==========================================
    // UPDATE ADDRESS
    // ==========================================

    updateAddress(
        id: number,
        address: Address
    ): Observable<Address> {

        return this.http.put<Address>(
            `${this.apiUrl}/${id}`,
            address
        );

    }


    // ==========================================
    // DELETE ADDRESS
    // ==========================================

    deleteAddress(
        id: number
    ): Observable<any> {

        return this.http.delete(
            `${this.apiUrl}/${id}`
        );

    }


    // ==========================================
    // SET DEFAULT ADDRESS
    // ==========================================

    setDefaultAddress(
        id: number
    ): Observable<Address> {

        return this.http.put<Address>(
            `${this.apiUrl}/${id}/default`,
            {}
        );

    }

}