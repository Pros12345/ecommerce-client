import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  HttpClient
} from '@angular/common/http';

import Swal from 'sweetalert2';

import {
  OrderService,
  OrderResponse,
  OrderItemResponse
} from '../order.service';

import {
  environment
} from '../../../../environments/environment';


@Component({

  selector: 'app-order-history',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './order-history.component.html',

  styleUrls: [
    './order-history.component.scss'
  ]

})


export class OrderHistoryComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // ORDERS
  // ==========================================

  orders: OrderResponse[] = [];


  // ==========================================
  // LOADING
  // ==========================================

  loading = false;


  // ==========================================
  // IMAGE OBJECT URLS
  // ==========================================

  private imageObjectUrls: string[] = [];


  // ==========================================
  // FALLBACK IMAGE
  // ==========================================

  private readonly fallbackImage =
    'assets/Logo.png';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private orderService: OrderService,

    private router: Router,

    private http: HttpClient

  ) { }


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // ==========================================
  // LOAD ORDERS
  // ==========================================

  loadOrders(): void {

    this.loading = true;


    this.orderService
      .getMyOrders()
      .subscribe({

        next: (
          response: OrderResponse[]
        ) => {


          this.orders =
            response.map(

              (
                order: OrderResponse
              ) => {


                // ==================================
                // CHECK ORDER ITEMS
                // ==================================

                if (

                  order.items &&

                  order.items.length > 0

                ) {


                  order.items =
                    order.items.map(

                      (
                        item: OrderItemResponse
                      ) => {



                        // ==================================
                        // DEFAULT FALLBACK IMAGE
                        // ==================================

                        item.image =
                          this.fallbackImage;


                        // ==================================
                        // CONVERT IMAGE ID
                        // ==================================

                        const imageId =
                          Number(item.imageId);



                        // ==================================
                        // VALIDATE IMAGE ID
                        // ==================================

                        if (

                          Number.isFinite(
                            imageId
                          )

                          &&

                          imageId > 0

                        ) {


                          // ==================================
                          // LOAD IMAGE
                          // ==================================

                          this.loadProductImage(

                            item,

                            imageId

                          );

                        }

                        else {


                          console.warn(
                            'INVALID IMAGE ID:',
                            item.imageId
                          );


                          console.warn(
                            'PRODUCT:',
                            item.productName
                          );


                          item.image =
                            this.fallbackImage;

                        }


                        return item;

                      }

                    );

                }

                else {


                  console.warn(
                    'NO ORDER ITEMS FOUND FOR ORDER:',
                    order.orderId
                  );

                }


                return order;

              }

            );


          this.loading = false;


        },


        error: (

          error

        ) => {


          console.error(
            '===================================='
          );


          console.error(
            'UNABLE TO LOAD ORDERS:',
            error
          );


          console.error(
            '===================================='
          );


          this.loading = false;

        }

      });

  }


  // ==========================================
  // GET ORDER STATUS LABEL
  // ==========================================

  getOrderStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'PLACED':

        return 'PLACED';


      case 'ON_THE_WAY':

        return 'ON THE WAY';


      case 'CANCELLED':

        return 'CANCELLED';


      case 'DELIVERED':

        return 'DELIVERED';


      default:

        return status || 'UNKNOWN';

    }

  }


  // ==========================================
  // LOAD PRODUCT IMAGE
  // ==========================================

  loadProductImage(

    item: OrderItemResponse,

    imageId: number

  ): void {


    // ==========================================
    // FINAL SAFETY CHECK
    // ==========================================

    if (

      !Number.isFinite(
        imageId
      )

      ||

      imageId <= 0

    ) {


      console.error(
        'INVALID IMAGE ID PASSED TO loadProductImage:',
        imageId
      );


      item.image =
        this.fallbackImage;


      return;

    }


    // ==========================================
    // CREATE IMAGE URL
    // ==========================================

    const imageUrl =
      `${environment.apiBaseUrl}/images/${imageId}`;


    // ==========================================
    // REQUEST IMAGE
    // ==========================================

    this.http

      .get(

        imageUrl,

        {
          responseType: 'blob'
        }

      )

      .subscribe({

        // ======================================
        // IMAGE SUCCESS
        // ======================================

        next: (

          blob: Blob

        ) => {


          // ====================================
          // CHECK EMPTY RESPONSE
          // ====================================

          if (

            !blob

            ||

            blob.size === 0

          ) {


            console.error(
              'EMPTY IMAGE RESPONSE:',
              imageId
            );


            item.image =
              this.fallbackImage;


            return;

          }


          // ====================================
          // CREATE BLOB URL
          // ====================================

          const objectUrl =
            URL.createObjectURL(
              blob
            );


          // ====================================
          // STORE OBJECT URL
          // ====================================

          this.imageObjectUrls.push(
            objectUrl
          );


          // ====================================
          // ASSIGN IMAGE
          // ====================================

          item.image =
            objectUrl;


        },


        // ======================================
        // IMAGE ERROR
        // ======================================

        error: (

          error

        ) => {


          console.error(
            'UNABLE TO LOAD ORDER IMAGE:',
            imageId
          );


          console.error(
            'IMAGE URL:',
            imageUrl
          );


          console.error(
            'ERROR:',
            error
          );


          item.image =
            this.fallbackImage;

        }

      });

  }


  // ==========================================
  // CANCEL ORDER
  // ==========================================

  cancelOrder(
    orderId: number
  ): void {


    Swal.fire({

      title: 'Cancel Order?',

      html: `
        <div style="font-size: 15px; line-height: 1.6;">
          Are you sure you want to cancel
          <strong>Order #${orderId}</strong>?
          <br>
          <span style="color: #777;">
            This action cannot be undone.
          </span>
        </div>
      `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Cancel Order',

      cancelButtonText: 'No, Keep Order',

      confirmButtonColor: '#d33',

      cancelButtonColor: '#6c757d',

      reverseButtons: true,

      focusCancel: true

    }).then((result) => {


      // ==========================================
      // USER CLICKED NO
      // ==========================================

      if (!result.isConfirmed) {

        return;

      }


      // ==========================================
      // SHOW LOADING
      // ==========================================

      Swal.fire({

        title: 'Cancelling Order...',

        text: 'Please wait while we cancel your order.',

        allowOutsideClick: false,

        allowEscapeKey: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      // ==========================================
      // CANCEL ORDER API
      // ==========================================

      this.orderService
        .cancelOrder(orderId)
        .subscribe({

          // ======================================
          // SUCCESS
          // ======================================

          next: (
            response: OrderResponse
          ) => {


            // ====================================
            // FIND ORDER
            // ====================================

            const order =
              this.orders.find(
                o =>
                  o.orderId === orderId
              );


            // ====================================
            // UPDATE STATUS
            // ====================================

            if (order) {

              order.orderStatus =
                response.orderStatus;

            }


            // ====================================
            // SUCCESS MESSAGE
            // ====================================

            Swal.fire({

              title: 'Order Cancelled!',

              text:
                `Order #${orderId} has been cancelled successfully.`,

              icon: 'success',

              confirmButtonText: 'OK',

              confirmButtonColor: '#2874f0',

              timer: 2500,

              timerProgressBar: true

            });

          },


          // ======================================
          // ERROR
          // ======================================

          error: (

            error

          ) => {


            console.error(
              'Unable to cancel order:',
              error
            );


            const message =
              error?.error?.message
              ||
              'Unable to cancel order. Please try again.';


            Swal.fire({

              title: 'Cancellation Failed',

              text: message,

              icon: 'error',

              confirmButtonText: 'OK',

              confirmButtonColor: '#d33'

            });

          }

        });

    });

  }


  // ==========================================
  // MARK ORDER ON THE WAY
  // ==========================================

  markOrderOnTheWay(

    orderId: number

  ): void {


    this.orderService
      .markOrderOnTheWay(
        orderId
      )
      .subscribe({

        next: (

          response: OrderResponse

        ) => {


          const order =
            this.orders.find(

              o =>
                o.orderId === orderId

            );


          if (order) {

            order.orderStatus =
              response.orderStatus;

          }

        },


        error: (

          error

        ) => {


          console.error(
            'Unable to update order status:',
            error
          );


          const message =
            error?.error?.message
            ||
            'Unable to update order status.';


          alert(
            message
          );

        }

      });

  }


  // ==========================================
  // DELETE CANCELLED ORDER
  // ==========================================

  deleteOrder(

    orderId: number

  ): void {


    // ==========================================
    // SWEETALERT DELETE CONFIRMATION
    // ==========================================

    Swal.fire({

      title: 'Delete Order?',

      html: `
        <div style="font-size: 15px; line-height: 1.6;">
          Are you sure you want to delete
          <strong>Order #${orderId}</strong>?
          <br>
          <span style="color: #777;">
            This cancelled order will be permanently removed
            from your order history.
          </span>
        </div>
      `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Delete Order',

      cancelButtonText: 'No, Keep Order',

      confirmButtonColor: '#d33',

      cancelButtonColor: '#6c757d',

      reverseButtons: true,

      focusCancel: true

    }).then((result) => {


      // ==========================================
      // USER CLICKED CANCEL
      // ==========================================

      if (!result.isConfirmed) {

        return;

      }


      // ==========================================
      // SHOW LOADING
      // ==========================================

      Swal.fire({

        title: 'Deleting Order...',

        text: 'Please wait while we remove the order.',

        allowOutsideClick: false,

        allowEscapeKey: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      // ==========================================
      // DELETE ORDER API
      // ==========================================

      this.orderService
        .deleteOrder(
          orderId
        )
        .subscribe({

          // ======================================
          // SUCCESS
          // ======================================

          next: () => {


            // ====================================
            // REMOVE ORDER FROM UI
            // ====================================

            this.orders =
              this.orders.filter(

                order =>
                  order.orderId !== orderId

              );


            // ====================================
            // SUCCESS MESSAGE
            // ====================================

            Swal.fire({

              title: 'Order Deleted!',

              text:
                `Order #${orderId} has been deleted successfully.`,

              icon: 'success',

              confirmButtonText: 'OK',

              confirmButtonColor: '#2874f0',

              timer: 2500,

              timerProgressBar: true

            });

          },


          // ======================================
          // ERROR
          // ======================================

          error: (

            error

          ) => {


            console.error(
              'Unable to delete order:',
              error
            );


            const message =
              error?.error?.message
              ||
              'Unable to delete order. Please try again.';


            Swal.fire({

              title: 'Delete Failed',

              text: message,

              icon: 'error',

              confirmButtonText: 'OK',

              confirmButtonColor: '#d33'

            });

          }

        });

    });

  }


  // ==========================================
  // BACK TO PROFILE
  // ==========================================

  backToProfile(): void {

    this.router.navigate([
      '/profile'
    ]);

  }


  // ==========================================
  // COMPONENT DESTROY
  // ==========================================

  ngOnDestroy(): void {


    this.imageObjectUrls.forEach(

      (
        objectUrl: string
      ) => {


        URL.revokeObjectURL(
          objectUrl
        );

      }

    );


    this.imageObjectUrls = [];

  }

}