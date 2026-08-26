import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import Swal from 'sweetalert2';

import {
  CartService,
  CartItem
} from '../cart.component/cart.service';

import {
  Address
} from '../address/address';

import {
  OrderService,
  OrderRequest
} from './order.service';


@Component({

  selector: 'app-confirm-order',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl:
    './confirm-order.component.html',

  styleUrls: [
    './confirm-order.component.scss'
  ]

})


export class ConfirmOrderComponent
  implements OnInit {


  // ==========================================
  // CART
  // ==========================================

  cartItems: CartItem[] = [];


  // ==========================================
  // ADDRESS
  // ==========================================

  selectedAddress: Address | null = null;


  // ==========================================
  // PRICE
  // ==========================================

  totalItemPrice: number = 0;

  totalAmount: number = 0;


  // ==========================================
  // PAYMENT
  // ==========================================

  /*
   * IMPORTANT:
   *
   * Backend accepts "COD".
   *
   * Do not use "CASH_ON_DELIVERY" here.
   */

  paymentMethod: string = 'COD';


  // ==========================================
  // ORDER STATE
  // ==========================================

  placingOrder: boolean = false;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private cartService: CartService,

    private orderService: OrderService,

    private router: Router

  ) { }


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    // ========================================
    // LOAD CART
    // ========================================

    this.cartItems =
      this.cartService.getCartItems();


    // ========================================
    // CHECK CART
    // ========================================

    if (
      this.cartItems.length === 0
    ) {

      Swal.fire({

        title: 'Cart Empty',

        text: 'Your cart is empty.',

        icon: 'warning',

        confirmButtonColor: '#2874f0'

      }).then(() => {

        this.router.navigate([
          '/cart'
        ]);

      });

      return;

    }


    // ========================================
    // CALCULATE TOTAL
    // ========================================

    this.calculateTotal();


    // ========================================
    // LOAD SELECTED ADDRESS
    // ========================================

    const addressData =
      localStorage.getItem(
        'selectedAddress'
      );


    if (!addressData) {

      Swal.fire({

        title: 'Address Required',

        text:
          'Please select a delivery address.',

        icon: 'warning',

        confirmButtonColor: '#2874f0'

      }).then(() => {

        this.router.navigate([
          '/checkout-address'
        ]);

      });

      return;

    }


    try {

      this.selectedAddress =
        JSON.parse(addressData);

    } catch (error) {

      console.error(
        'Unable to parse selected address:',
        error
      );


      localStorage.removeItem(
        'selectedAddress'
      );


      Swal.fire({

        title: 'Address Error',

        text:
          'Unable to load selected address.',

        icon: 'error'

      }).then(() => {

        this.router.navigate([
          '/checkout-address'
        ]);

      });

    }

  }


  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  calculateTotal(): void {

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


    this.totalAmount =
      this.totalItemPrice;

  }


  // ==========================================
  // CHANGE ADDRESS
  // ==========================================

  changeAddress(): void {

    this.router.navigate([
      '/checkout-address'
    ]);

  }


  // ==========================================
  // BACK TO CART
  // ==========================================

  backToCart(): void {

    this.router.navigate([
      '/cart'
    ]);

  }


  // ==========================================
  // PLACE ORDER
  // ==========================================

  placeOrder(): void {


    // ========================================
    // CHECK ADDRESS
    // ========================================

    if (
      !this.selectedAddress ||
      !this.selectedAddress.id
    ) {

      Swal.fire({

        title: 'Address Required',

        text:
          'Please select a delivery address.',

        icon: 'warning'

      });

      return;

    }


    // ========================================
    // CHECK CART
    // ========================================

    if (
      this.cartItems.length === 0
    ) {

      Swal.fire({

        title: 'Cart Empty',

        text:
          'Your cart is empty.',

        icon: 'warning'

      });

      return;

    }


    // ========================================
    // CHECK PAYMENT
    // ========================================

    if (
      this.paymentMethod !== 'COD'
    ) {

      Swal.fire({

        title: 'Payment Required',

        text:
          'Only Cash on Delivery is available.',

        icon: 'warning'

      });

      return;

    }


    // ========================================
    // FINAL CONFIRMATION
    // ========================================

    Swal.fire({

      title: 'Place Order?',

      text:
        'Your order will be placed using Cash on Delivery.',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText:
        'Yes, Place Order',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#ff641f'

    }).then((result) => {

      if (
        !result.isConfirmed
      ) {

        return;

      }


      this.submitOrder();

    });

  }


  // ==========================================
  // SUBMIT ORDER TO BACKEND
  // ==========================================

  submitOrder(): void {

    // ========================================
    // PREVENT DOUBLE CLICK
    // ========================================

    if (this.placingOrder) {

      return;

    }


    this.placingOrder = true;


    // ========================================
    // CREATE REQUEST
    // ========================================

    /*
     * This exactly matches your backend:
     *
     * OrderRequest
     *
     * addressId
     * paymentMethod
     * items
     *
     * Do NOT send totalAmount.
     * Do NOT send price.
     *
     * Backend calculates the price from
     * the database product.
     */

    const orderRequest: OrderRequest = {

      addressId:
        this.selectedAddress!.id!,

      paymentMethod:
        'COD',

      items:
        this.cartItems.map(
          item => ({

            productId:
              item.id,

            quantity:
              item.quantity

          })
        )

    };


    console.log(
      'Sending order request:',
      orderRequest
    );


    // ========================================
    // CALL BACKEND
    // ========================================

    this.orderService
      .placeOrder(orderRequest)
      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: (response) => {

          console.log(
            'Order placed successfully:',
            response
          );


          this.placingOrder = false;


          // ==================================
          // CLEAR CART
          // ==================================

          this.cartService.clearCart();


          // ==================================
          // REMOVE TEMPORARY ADDRESS
          // ==================================

          localStorage.removeItem(
            'selectedAddress'
          );


          // ==================================
          // SUCCESS MESSAGE
          // ==================================

          Swal.fire({

            title: 'Order Placed!',

            text:
              `Your order #${response.orderId} has been placed successfully.`,

            icon: 'success',

            confirmButtonText:
              'Continue',

            confirmButtonColor:
              '#2874f0',

            allowOutsideClick: false

          }).then(() => {

            // ================================
            // GO TO HOME
            // ================================

            this.router.navigate([
              '/home'
            ]);

          });

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error) => {

          console.error(
            'Place order error:',
            error
          );


          this.placingOrder = false;


          let errorMessage =
            'Unable to place the order. Please try again.';


          if (
            error?.error?.message
          ) {

            errorMessage =
              error.error.message;

          } else if (
            typeof error?.error === 'string'
          ) {

            errorMessage =
              error.error;

          }


          Swal.fire({

            title: 'Order Failed',

            text: errorMessage,

            icon: 'error',

            confirmButtonColor:
              '#2874f0'

          });

        }

      });

  }

}