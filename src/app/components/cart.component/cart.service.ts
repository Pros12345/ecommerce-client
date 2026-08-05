import { Injectable } from '@angular/core';
import { Product } from '../../../model/product';
import { environment } from '../../../environments/environment.prod';

export interface CartItem {

    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;

}

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private STORAGE_KEY = 'cartItems';

    getCartItems(): CartItem[] {

        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

    }

    addToCart(product: Product): void {

        const cart = this.getCartItems();

        const existing = cart.find(item => item.id === product.id);

        if (existing) {

            existing.quantity++;

        } else {

            cart.push({

                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.images.length > 0
                    ? `${environment.apiBaseUrl}/api/images/${product.images[0].id}`
                    : 'assets/no-image.png'

            });

        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));

    }

    removeItem(id: number): void {

        const cart = this.getCartItems().filter(item => item.id !== id);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));

    }

    updateCart(cart: CartItem[]): void {

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));

    }

    isInCart(productId: number): boolean {

        return this.getCartItems().some(item => item.id === productId);

    }

}