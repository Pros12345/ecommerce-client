import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class EditProductService {

    private baseUrl = `${environment.apiBaseUrl}/products`;
    constructor(private http: HttpClient) { }

    getProduct(id: number): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}/${id}`
        );
    }

    updateProduct(
        id: number,
        product: any,
        newImages: File[],
        deletedImageIds: number[]
    ): Observable<any> {
        const formData = new FormData();
        formData.append(
            'product',
            new Blob(
                [JSON.stringify(product)],
                {
                    type: 'application/json'
                }
            )
        );

        if (newImages && newImages.length > 0) {
            newImages.forEach(file => {
                formData.append(
                    'newImages',
                    file
                );
            });
        }

        if (deletedImageIds && deletedImageIds.length > 0) {
            formData.append(
                'deletedImageIds',
                new Blob(
                    [JSON.stringify(deletedImageIds)],
                    {
                        type: 'application/json'
                    }
                )
            );
        }

        return this.http.put(
            `${this.baseUrl}/${id}`,
            formData,
            {
                responseType: 'text'
            }
        );

    }

}