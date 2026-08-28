import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  HttpClient
} from '@angular/common/http';

import Swal from 'sweetalert2';

import {
  environment
} from '../../../environments/environment';


export interface AdminAddress {

  id: number;

  fullName: string;

  mobileNumber: string;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  pincode: string;

  landmark?: string;

  addressType: string;
}


export interface AdminOrderItem {

  productId: number;

  productName: string;

  quantity: number;

  price: number;
}


export interface AdminOrder {

  orderId: number;

  totalAmount: number;

  paymentMethod: string;

  orderStatus: string;

  orderDate: string;

  address: AdminAddress;

  items: AdminOrderItem[];
}


export interface AdminUser {

  id: number;

  firstName: string;

  email: string;

  countryCode: string;

  mobileNumber: string;

  addresses: AdminAddress[];

  orders: AdminOrder[];
}


@Component({

  selector: 'app-admin-users',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './admin-users.component.html',

  styleUrls: [
    './admin-users.component.scss'
  ]

})


export class AdminUsersComponent
  implements OnInit {


  users: AdminUser[] = [];


  loading = false;


  private readonly apiUrl =
    `${environment.apiBaseUrl}/admin/users`;


  constructor(

    private http: HttpClient,

    private router: Router

  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadUsers();

  }


  // =====================================================
  // LOAD USERS
  // =====================================================

  loadUsers(): void {

    this.loading = true;


    this.http
      .get<AdminUser[]>(
        this.apiUrl
      )
      .subscribe({

        next: (
          response
        ) => {

          this.users =
            response;

          this.loading =
            false;
        },


        error: (
          error
        ) => {

          this.loading =
            false;


          if (
            error.status === 403
          ) {

            Swal.fire(
              'Access denied',
              'You are not authorized to view this page.',
              'error'
            ).then(() => {

              this.router.navigate([
                '/home'
              ]);

            });

            return;
          }


          Swal.fire(
            'Error',
            'Unable to load users.',
            'error'
          );

        }

      });

  }


  // =====================================================
  // DELETE USER
  // =====================================================

  deleteUser(
    user: AdminUser
  ): void {


    Swal.fire({

      title:
        `Delete ${user.firstName}?`,

      html:
        `This will permanently delete ` +
        `<strong>${this.escapeHtml(user.email)}</strong>, ` +
        `all saved addresses and all orders.` +
        `<br><br>` +
        `This action cannot be undone.`,

      icon:
        'warning',

      showCancelButton:
        true,

      confirmButtonText:
        'Yes, delete user',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#d33'

    }).then((result) => {


      if (!result.isConfirmed) {

        return;
      }


      this.http
        .delete<{
          message: string
        }>(
          `${this.apiUrl}/${user.id}`
        )
        .subscribe({

          next: () => {


            this.users =
              this.users.filter(
                item =>
                  item.id !== user.id
              );


            Swal.fire(
              'Deleted',
              'User, addresses and orders were deleted.',
              'success'
            );

          },


          error: (
            error
          ) => {


            if (
              error.status === 403
            ) {

              Swal.fire(
                'Access denied',
                'You are not authorized to delete users.',
                'error'
              );

              return;
            }


            Swal.fire(
              'Delete failed',
              error?.error?.message ??
              'Unable to delete the user.',
              'error'
            );

          }

        });

    });

  }


  // =====================================================
  // BACK
  // =====================================================

  backToProfile(): void {

    this.router.navigate([
      '/profile'
    ]);

  }


  // =====================================================
  // HTML ESCAPE
  // =====================================================

  private escapeHtml(
    value: string
  ): string {

    return value

      .replace(
        /&/g,
        '&amp;'
      )

      .replace(
        /</g,
        '&lt;'
      )

      .replace(
        />/g,
        '&gt;'
      )

      .replace(
        /"/g,
        '&quot;'
      )

      .replace(
        /'/g,
        '&#039;'
      );

  }

}