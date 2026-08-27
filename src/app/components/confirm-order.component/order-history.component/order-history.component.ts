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
  //
  // Blob URLs created for product images.
  // They are released when component is
  // destroyed.
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

          console.log(
            '===================================='
          );

          console.log(
            'ORDER API RESPONSE:',
            response
          );

          console.log(
            '===================================='
          );


          this.orders =
            response.map(

              (
                order: OrderResponse
              ) => {


                console.log(
                  'ORDER:',
                  order
                );


                console.log(
                  'ORDER ID:',
                  order.orderId
                );


                console.log(
                  'ORDER STATUS:',
                  order.orderStatus
                );


                console.log(
                  'ORDER ITEMS:',
                  order.items
                );


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


                        console.log(
                          '--------------------------------'
                        );


                        console.log(
                          'ORDER ITEM:',
                          item
                        );


                        console.log(
                          'PRODUCT NAME:',
                          item.productName
                        );


                        // ==================================
                        // IMPORTANT
                        //
                        // imageId comes from backend.
                        //
                        // Do NOT use item.image here.
                        // ==================================

                        console.log(
                          'IMAGE ID:',
                          item.imageId
                        );


                        console.log(
                          'IMAGE ID TYPE:',
                          typeof item.imageId
                        );


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


                        console.log(
                          'CONVERTED IMAGE ID:',
                          imageId
                        );


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


                          console.log(
                            'VALID IMAGE ID:',
                            imageId
                          );


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


          console.log(
            'FINAL ORDERS:',
            this.orders
          );

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
  //
  // Backend:
  //
  // GET /api/images/{id}
  //
  // Example:
  //
  // GET http://localhost:8080/api/images/5
  //
  // The response is converted to Blob and
  // then to a browser Object URL.
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


    console.log(
      'REQUESTING ORDER IMAGE:',
      imageUrl
    );


    // ==========================================
    // REQUEST IMAGE
    //
    // HttpClient is used so the AuthInterceptor
    // can add JWT if required.
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


          console.log(
            'ORDER IMAGE RESPONSE:',
            imageId
          );


          console.log(
            'BLOB SIZE:',
            blob.size
          );


          console.log(
            'BLOB TYPE:',
            blob.type
          );


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


          console.log(
            'ORDER IMAGE LOADED:',
            imageId
          );


          console.log(
            'BLOB OBJECT URL:',
            objectUrl
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


          console.log(
            'IMAGE ASSIGNED:',
            item.image
          );

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


    if (

      !confirm(
        'Are you sure you want to cancel this order?'
      )

    ) {

      return;

    }


    this.orderService
      .cancelOrder(
        orderId
      )
      .subscribe({

        next: (

          response: OrderResponse

        ) => {


          console.log(
            'ORDER CANCELLED:',
            response
          );


          const order =
            this.orders.find(

              o =>
                o.orderId === orderId

            );


          if (order) {

            // Use status returned by backend
            order.orderStatus =
              response.orderStatus;

          }

        },


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
            'Unable to cancel order.';


          alert(
            message
          );

        }

      });

  }


  // ==========================================
  // MARK ORDER ON THE WAY
  //
  // This method is available if you want to
  // call the ON_THE_WAY API from Angular.
  //
  // IMPORTANT:
  // For a real application this should be
  // available only to an ADMIN/DELIVERY USER.
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


          console.log(
            'ORDER MARKED ON THE WAY:',
            response
          );


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


    if (

      !confirm(
        'Are you sure you want to delete this cancelled order?'
      )

    ) {

      return;

    }


    this.orderService
      .deleteOrder(
        orderId
      )
      .subscribe({

        next: () => {


          console.log(
            'ORDER DELETED:',
            orderId
          );


          this.orders =
            this.orders.filter(

              order =>
                order.orderId !== orderId

            );

        },


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
            'Unable to delete order.';


          alert(
            message
          );

        }

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
  //
  // Release Blob URLs.
  // ==========================================

  ngOnDestroy(): void {


    console.log(
      'Releasing image object URLs...'
    );


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