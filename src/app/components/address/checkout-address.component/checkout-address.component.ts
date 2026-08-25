import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import Swal from 'sweetalert2';

import {
  Address
} from '../address';

import {
  AddressService
} from '../address.service';


@Component({

  selector: 'app-checkout-address',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './checkout-address.component.html',

  styleUrls: [
    './checkout-address.component.scss'
  ]

})
export class CheckoutAddressComponent
  implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  addresses: Address[] = [];

  selectedAddress: Address | null = null;

  isAddingNewAddress = false;

  isEditing = false;

  loading = false;


  newAddress: Address = {

    fullName: '',

    mobileNumber: '',

    addressLine1: '',

    addressLine2: '',

    city: '',

    state: '',

    pincode: '',

    landmark: '',

    addressType: 'HOME'

  };


  constructor(

    private addressService:
      AddressService,

    private router: Router

  ) { }


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadAddresses();

  }


  // ==========================================
  // LOAD SAVED ADDRESSES
  // ==========================================

  loadAddresses(): void {

    this.loading = true;

    this.addressService
      .getAddresses()
      .subscribe({

        next: (response) => {

          this.addresses = response;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Unable to load addresses',
            error
          );

          this.loading = false;

          Swal.fire(
            'Error',
            'Unable to load saved addresses.',
            'error'
          );

        }

      });

  }


  // ==========================================
  // SELECT ADDRESS
  // ==========================================

  selectAddress(
    address: Address
  ): void {

    this.selectedAddress = address;

  }


  // ==========================================
  // ADD NEW ADDRESS
  // ==========================================

  addNewAddress(): void {

    this.isAddingNewAddress = true;

    this.isEditing = false;

    this.selectedAddress = null;

    this.resetForm();

  }


  // ==========================================
  // EDIT ADDRESS
  // ==========================================

  editAddress(
    address: Address
  ): void {

    this.selectedAddress = address;

    this.isAddingNewAddress = false;

    this.isEditing = true;

    this.newAddress = {

      id: address.id,

      fullName: address.fullName,

      mobileNumber:
        address.mobileNumber,

      addressLine1:
        address.addressLine1,

      addressLine2:
        address.addressLine2 || '',

      city:
        address.city,

      state:
        address.state,

      pincode:
        address.pincode,

      landmark:
        address.landmark || '',

      addressType:
        address.addressType

    };

  }


  // ==========================================
  // SAVE NEW ADDRESS
  // ==========================================

  saveNewAddress(): void {

    if (!this.validateAddress()) {

      return;

    }

    this.addressService
      .addAddress(this.newAddress)
      .subscribe({

        next: (savedAddress) => {

          this.addresses.push(
            savedAddress
          );

          this.selectedAddress =
            savedAddress;

          this.isAddingNewAddress =
            false;

          Swal.fire(
            'Success',
            'Address saved successfully.',
            'success'
          );

        },

        error: (error) => {

          console.error(
            error
          );

          Swal.fire(
            'Error',
            'Unable to save address.',
            'error'
          );

        }

      });

  }


  // ==========================================
  // UPDATE ADDRESS
  // ==========================================

  updateAddress(): void {

    if (
      !this.selectedAddress?.id
    ) {

      return;

    }

    if (!this.validateAddress()) {

      return;

    }

    this.addressService
      .updateAddress(
        this.selectedAddress.id,
        this.newAddress
      )
      .subscribe({

        next: (updatedAddress) => {

          const index =
            this.addresses.findIndex(
              address =>
                address.id ===
                updatedAddress.id
            );

          if (index !== -1) {

            this.addresses[index] =
              updatedAddress;

          }

          this.selectedAddress =
            updatedAddress;

          this.isEditing = false;

          Swal.fire(
            'Updated',
            'Address updated successfully.',
            'success'
          );

        },

        error: (error) => {

          console.error(
            error
          );

          Swal.fire(
            'Error',
            'Unable to update address.',
            'error'
          );

        }

      });

  }


  // ==========================================
  // CONFIRM ADDRESS
  // ==========================================

  confirmAddress(): void {

    if (!this.selectedAddress) {

      Swal.fire(
        'Select Address',
        'Please select a delivery address.',
        'warning'
      );

      return;

    }

    Swal.fire({

      title: 'Confirm Address',

      text:
        'Do you want to deliver the order to this address?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText:
        'Confirm & Place Order',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#ff641f'

    }).then((result) => {

      if (result.isConfirmed) {

        this.placeOrder();

      }

    });

  }


  // ==========================================
  // PLACE ORDER
  // ==========================================

  placeOrder(): void {

    if (!this.selectedAddress?.id) {

      return;

    }

    /*
     * IMPORTANT:
     *
     * Here you will call your existing
     * OrderService.
     *
     * Example:
     *
     * this.orderService.placeOrder(
     *   this.selectedAddress.id
     * )
     */

    console.log(
      'Selected address ID:',
      this.selectedAddress.id
    );

    /*
     * Temporarily navigate to order page
     * until your existing OrderService
     * is connected.
     */

    Swal.fire(
      'Order',
      'Address confirmed. Connect this to your existing order API.',
      'success'
    );

  }


  // ==========================================
  // VALIDATION
  // ==========================================

  validateAddress(): boolean {

    if (
      !this.newAddress.fullName ||
      !this.newAddress.mobileNumber ||
      !this.newAddress.addressLine1 ||
      !this.newAddress.city ||
      !this.newAddress.state ||
      !this.newAddress.pincode
    ) {

      Swal.fire(
        'Missing Information',
        'Please fill all required address fields.',
        'warning'
      );

      return false;

    }

    return true;

  }


  // ==========================================
  // RESET FORM
  // ==========================================

  resetForm(): void {

    this.newAddress = {

      fullName: '',

      mobileNumber: '',

      addressLine1: '',

      addressLine2: '',

      city: '',

      state: '',

      pincode: '',

      landmark: '',

      addressType: 'HOME'

    };

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancelForm(): void {

    this.isAddingNewAddress = false;

    this.isEditing = false;

    this.selectedAddress = null;

  }


  // ==========================================
  // BACK TO CART
  // ==========================================

  backToCart(): void {

    this.router.navigate([
      '/cart'
    ]);

  }

}