import { Injectable } from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})


export class ProductService {


    private baseUrl =
        `${environment.apiBaseUrl}/products`;


    constructor(
        private http: HttpClient
    ) { }


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    addProduct(

        productData: any,

        images: File[]

    ): Observable<any> {


        const formData =
            new FormData();


        // --------------------------------------
        // PRODUCT JSON
        // --------------------------------------

        formData.append(

            'product',

            new Blob(

                [
                    JSON.stringify(
                        productData
                    )
                ],

                {
                    type:
                        'application/json'
                }

            )

        );


        // --------------------------------------
        // IMAGES
        // --------------------------------------

        images.forEach(

            image => {

                formData.append(
                    'images',
                    image
                );

            }

        );


        return this.http.post(

            this.baseUrl,

            formData,

            {
                responseType: 'text'
            }

        );

    }

}