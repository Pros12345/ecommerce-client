import { Injectable } from '@angular/core';

import { Product } from '../../../model/product';
import { environment } from '../../../environments/environment';


export interface CartItem {

    id: number;

    name: string;

    price: number;

    quantity: number;

    availableQuantity: number;

    image: string;

}


@Injectable({
    providedIn: 'root'
})
export class CartService {

    private STORAGE_KEY = 'cartItems';


    // ==========================================
    // CLEAR CART
    // ==========================================

    clearCart(): void {

        localStorage.removeItem(
            this.STORAGE_KEY
        );

    }


    // ==========================================
    // GET CART ITEMS
    // ==========================================

    getCartItems(): CartItem[] {

        return JSON.parse(
            localStorage.getItem(this.STORAGE_KEY) || '[]'
        );

    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    addToCart(
        product: Product
    ): void {

        const cart =
            this.getCartItems();


        const existing =
            cart.find(
                item =>
                    item.id === product.id
            );


        if (existing) {


            if (
                existing.quantity >=
                existing.availableQuantity
            ) {

                alert(
                    'Only ' +
                    existing.availableQuantity +
                    ' item(s) available in stock.'
                );

                return;

            }


            existing.quantity++;


        }

        else {


            // ======================================
            // PRIMARY IMAGE
            // ======================================
            //
            // Backend puts primary image at index 0.
            // ======================================

            const primaryImage =
                product.images
                    ?.find(
                        image =>
                            image.primaryImage === true
                    )
                ||
                product.images?.[0];


            const imageUrl =
                primaryImage
                    ? `${environment.apiBaseUrl}/images/${primaryImage.id}`
                    : 'assets/Logo.png';


            cart.push({

                id:
                    product.id,

                name:
                    product.name,

                price:
                    product.price,

                quantity:
                    1,

                availableQuantity:
                    product.quantity,

                image:
                    imageUrl

            });

        }


        localStorage.setItem(

            this.STORAGE_KEY,

            JSON.stringify(
                cart
            )

        );

    }

    // ==========================================
    // REMOVE ITEM
    // ==========================================

    removeItem(id: number): void {

        const cart =
            this.getCartItems()
                .filter(item => item.id !== id);

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(cart)
        );

    }


    // ==========================================
    // UPDATE CART
    // ==========================================

    updateCart(cart: CartItem[]): void {

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(cart)
        );

    }


    // ==========================================
    // CHECK PRODUCT IN CART
    // ==========================================

    isInCart(productId: number): boolean {

        return this.getCartItems()
            .some(item => item.id === productId);

    }

}