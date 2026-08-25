import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import Swal from 'sweetalert2';

import { AddressService } from '../../address/address.service';
import { Address } from '../../address/address';

@Component({

  selector: 'app-edit-address',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './edit-address.component.html',

  styleUrls: [
    './edit-address.component.scss'
  ]

})
export class EditAddressComponent implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  addressForm!: FormGroup;

  addressId!: number;

  loading: boolean = false;

  saving: boolean = false;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router,

    private addressService: AddressService

  ) { }


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    this.createForm();

    this.addressId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.addressId) {

      Swal.fire({

        title: 'Error',

        text: 'Invalid address.',

        icon: 'error'

      });

      this.router.navigate([
        '/saved-address'
      ]);

      return;

    }

    this.loadAddress();

  }


  // ==========================================
  // CREATE FORM
  // ==========================================

  createForm(): void {

    this.addressForm = this.fb.group({

      fullName: [
        '',
        Validators.required
      ],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      addressLine1: [
        '',
        Validators.required
      ],

      addressLine2: [
        ''
      ],

      city: [
        '',
        Validators.required
      ],

      state: [
        '',
        Validators.required
      ],

      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{6}$')
        ]
      ],

      landmark: [
        ''
      ],

      addressType: [
        'Home',
        Validators.required
      ]

    });

  }


  // ==========================================
  // LOAD ADDRESS
  // ==========================================

  loadAddress(): void {

    this.loading = true;

    this.addressService
      .getAddressById(this.addressId)
      .subscribe({

        next: (address: Address) => {

          this.addressForm.patchValue({

            fullName:
              address.fullName,

            mobileNumber:
              address.mobileNumber,

            addressLine1:
              address.addressLine1,

            addressLine2:
              address.addressLine2,

            city:
              address.city,

            state:
              address.state,

            pincode:
              address.pincode,

            landmark:
              address.landmark,

            addressType:
              address.addressType

          });

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Unable to load address:',
            error
          );

          this.loading = false;

          Swal.fire({

            title: 'Error',

            text:
              'Unable to load address.',

            icon: 'error'

          }).then(() => {

            this.router.navigate([
              '/saved-address'
            ]);

          });

        }

      });

  }


  // ==========================================
  // UPDATE ADDRESS
  // ==========================================

  updateAddress(): void {

    if (this.addressForm.invalid) {

      this.addressForm.markAllAsTouched();

      return;

    }

    this.saving = true;


    const address: Address = {

      id: this.addressId,

      fullName:
        this.addressForm.value.fullName,

      mobileNumber:
        this.addressForm.value.mobileNumber,

      addressLine1:
        this.addressForm.value.addressLine1,

      addressLine2:
        this.addressForm.value.addressLine2,

      city:
        this.addressForm.value.city,

      state:
        this.addressForm.value.state,

      pincode:
        this.addressForm.value.pincode,

      landmark:
        this.addressForm.value.landmark,

      addressType:
        this.addressForm.value.addressType

    };


    this.addressService
      .updateAddress(
        this.addressId,
        address
      )
      .subscribe({

        next: () => {

          this.saving = false;

          Swal.fire({

            title: 'Updated!',

            text:
              'Address updated successfully.',

            icon: 'success',

            confirmButtonColor:
              '#2874f0'

          }).then(() => {

            this.router.navigate([
              '/saved-address'
            ]);

          });

        },

        error: (error) => {

          console.error(
            'Unable to update address:',
            error
          );

          this.saving = false;

          Swal.fire({

            title: 'Error',

            text:
              'Unable to update address.',

            icon: 'error'

          });

        }

      });

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    this.router.navigate([
      '/saved-address'
    ]);

  }


  // ==========================================
  // FORM CONTROL HELPER
  // ==========================================

  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.addressForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }

}