import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  CartService,
  CartItem
} from './cart.service';


@Component({

  selector: 'app-cart',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './cart.component.html',

  styleUrls: [
    './cart.component.scss'
  ]

})


export class CartComponent
  implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  cartItems: CartItem[] = [];

  totalItemPrice: number = 0;

  totalDiscount: number = 0;

  totalAmount: number = 0;



  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private cartService: CartService,

    private router: Router

  ) { }



  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    this.cartItems =
      this.cartService.getCartItems();

    this.calculateTotals();

  }



  // ==========================================
  // INCREMENT QUANTITY
  // ==========================================

  incrementQuantity(
    item: CartItem
  ): void {

    if (
      item.quantity >=
      item.availableQuantity
    ) {

      alert(
        `Only ${item.availableQuantity} item(s) available.`
      );

      return;

    }


    item.quantity++;

    this.cartService.updateCart(
      this.cartItems
    );

    this.calculateTotals();

  }



  // ==========================================
  // DECREMENT QUANTITY
  // ==========================================

  decrementQuantity(
    item: CartItem
  ): void {

    if (item.quantity > 1) {

      item.quantity--;

      this.cartService.updateCart(
        this.cartItems
      );

      this.calculateTotals();

    }

  }



  // ==========================================
  // REMOVE ITEM
  // ==========================================

  removeItem(
    item: CartItem
  ): void {

    this.cartItems =
      this.cartItems.filter(
        i => i.id !== item.id
      );


    this.cartService.updateCart(
      this.cartItems
    );


    this.calculateTotals();

  }



  // ==========================================
  // CALCULATE TOTALS
  // ==========================================

  calculateTotals(): void {

    this.totalItemPrice =
      this.cartItems.reduce(

        (
          sum,
          item
        ) =>
          sum +
          (
            item.price *
            item.quantity
          ),

        0

      );


    this.totalDiscount = 0;


    this.totalAmount =
      this.totalItemPrice;

  }



  // ==========================================
  // PLACE ORDER
  // ==========================================

  placeOrder(): void {


    // ========================================
    // CHECK EMPTY CART
    // ========================================

    if (
      this.cartItems.length === 0
    ) {

      alert(
        'Your cart is empty.'
      );

      return;

    }


    // ========================================
    // OPEN ADDRESS PAGE
    // ========================================

    this.router.navigate([
      '/checkout-address'
    ]);

  }

}