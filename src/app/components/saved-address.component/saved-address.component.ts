import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { AddressService } from '../address/address.service';
import { Address } from '../address/address';

@Component({

  selector: 'app-saved-address',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './saved-address.component.html',

  styleUrls: [
    './saved-address.component.scss'
  ]

})
export class SavedAddressComponent implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  addresses: Address[] = [];

  loading: boolean = false;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private addressService: AddressService,

    private router: Router

  ) { }


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    this.loadAddresses();

  }


  // ==========================================
  // LOAD ADDRESSES
  // ==========================================

  loadAddresses(): void {

    this.loading = true;

    this.addressService
      .getAddresses()
      .subscribe({

        next: (response: Address[]) => {

          this.addresses = response;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Unable to load addresses:',
            error
          );

          this.loading = false;

          Swal.fire({
            title: 'Error',
            text: 'Unable to load saved addresses.',
            icon: 'error'
          });

        }

      });

  }


  // ==========================================
  // ADD NEW ADDRESS
  // ==========================================

  addNewAddress(): void {

    this.router.navigate([
      '/checkout-address'
    ]);

  }


  // ==========================================
  // EDIT ADDRESS
  // ==========================================

  editAddress(address: Address): void {

    this.router.navigate([
      '/edit-address',
      address.id
    ]);

  }


  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  deleteAddress(address: Address): void {

    Swal.fire({

      title: 'Delete Address?',

      text: 'Are you sure you want to delete this address?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#d33',

      cancelButtonColor: '#6c757d',

      reverseButtons: true

    }).then((result) => {

      if (!result.isConfirmed) {

        return;

      }


      this.addressService
        .deleteAddress(address.id!)
        .subscribe({

          next: () => {

            Swal.fire({

              title: 'Deleted!',

              text: 'Address deleted successfully.',

              icon: 'success',

              confirmButtonColor: '#2874f0'

            });

            this.loadAddresses();

          },

          error: (error) => {

            console.error(
              'Delete address error:',
              error
            );

            Swal.fire({

              title: 'Error',

              text: 'Unable to delete address.',

              icon: 'error'

            });

          }

        });

    });

  }


  // ==========================================
  // BACK TO PROFILE
  // ==========================================

  goBack(): void {

    this.router.navigate([
      '/profile'
    ]);

  }

}