import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from './cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalItemPrice: number = 0;
  totalDiscount: number = 0;
  totalAmount: number = 0;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotals();
  }

  incrementQuantity(item: CartItem): void {
    if (item.quantity >= item.availableQuantity) {
      alert(`Only ${item.availableQuantity} item(s) available.`);
      return;
    }
    item.quantity++;
    this.cartService.updateCart(this.cartItems);
    this.calculateTotals();
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cartItems);
      this.calculateTotals();
    }
  }

  removeItem(item: CartItem): void {
    this.cartItems =
      this.cartItems.filter(i => i.id !== item.id);
    this.cartService.updateCart(this.cartItems);
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalItemPrice = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    this.totalDiscount = 0;
    this.totalAmount = this.totalItemPrice;
  }
}