import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { ProfileService } from '../profile.component/profile.component.service';


@Component({
  selector: 'app-manage-account',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  savingProfile = false;
  changingPassword = false;
  isEditMode = false;
  showPasswordSection = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  successMessage = '';
  errorMessage = '';
  showDeleteModal = false;
  deletePassword = '';
  deleteError = '';
  deletingAccount = false;


  constructor(
    private fb: FormBuilder,

    private profileService: ProfileService,

    private router: Router
  ) { }


  ngOnInit(): void {

    this.profileForm = this.fb.group({

      firstName: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      countryCode: [
        '+91',
        Validators.required
      ],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      /*
       * Current password is required
       * ONLY when updating profile.
       */
      currentPassword: [
        ''
      ]

    });


    this.passwordForm = this.fb.group({

      currentPassword: [
        '',
        Validators.required
      ],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    });


    this.loadProfile();

  }


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  loadProfile(): void {

    this.loading = true;

    this.profileService.getProfile().subscribe({

      next: (profile) => {

        this.profileForm.patchValue({

          firstName: profile.firstName,

          email: profile.email,

          countryCode: profile.countryCode,

          mobileNumber: profile.mobileNumber

        });

        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Unable to load profile:',
          error
        );

        this.errorMessage =
          'Unable to load profile details.';

        this.loading = false;

      }

    });

  }


  // ==========================================
  // ENABLE EDIT
  // ==========================================

  enableEdit(): void {

    this.isEditMode = true;

    this.successMessage = '';

    this.errorMessage = '';

    this.profileForm
      .get('currentPassword')
      ?.setValue('');

  }


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  cancelEdit(): void {

    this.isEditMode = false;

    this.profileForm
      .get('currentPassword')
      ?.setValue('');

    this.successMessage = '';

    this.errorMessage = '';

    /*
     * Reload original server data.
     */
    this.loadProfile();

  }


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  updateProfile(): void {

    if (!this.isEditMode) {
      return;
    }


    if (this.profileForm.invalid) {

      this.profileForm.markAllAsTouched();

      return;

    }


    const currentPassword =
      this.profileForm
        .get('currentPassword')
        ?.value;


    if (!currentPassword) {

      this.errorMessage =
        'Current password is required.';

      this.profileForm
        .get('currentPassword')
        ?.markAsTouched();

      return;

    }


    this.savingProfile = true;

    this.successMessage = '';

    this.errorMessage = '';


    this.profileService
      .updateProfile(
        this.profileForm.value
      )
      .subscribe({

        next: (response) => {


          const updatedProfile =
            response?.user ?? response;


          if (updatedProfile.firstName) {

            localStorage.setItem(
              'userName',
              updatedProfile.firstName
            );

          }


          if (updatedProfile.email) {

            localStorage.setItem(
              'userEmail',
              updatedProfile.email
            );

          }


          /*
           * Password must never stay
           * inside the form after save.
           */
          this.profileForm
            .get('currentPassword')
            ?.setValue('');


          this.successMessage =
            'Profile updated successfully.';


          this.isEditMode = false;

          this.savingProfile = false;

        },


        error: (error) => {

          console.error(
            'Profile update error:',
            error
          );


          this.errorMessage =
            error.error?.message ||
            error.error ||
            'Unable to update profile.';


          this.savingProfile = false;

        }

      });

  }


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  changePassword(): void {

    if (this.passwordForm.invalid) {

      this.passwordForm.markAllAsTouched();

      return;

    }


    const currentPassword =
      this.passwordForm.value.currentPassword;

    const newPassword =
      this.passwordForm.value.newPassword;

    const confirmPassword =
      this.passwordForm.value.confirmPassword;


    if (newPassword !== confirmPassword) {

      this.errorMessage =
        'New password and confirm password do not match.';

      return;

    }


    this.changingPassword = true;

    this.successMessage = '';

    this.errorMessage = '';


    const passwordRequest = {

      currentPassword,

      newPassword,

      confirmPassword

    };


    this.profileService
      .changePassword(passwordRequest)
      .subscribe({

        next: (response) => {

          this.successMessage =
            response.message;

          this.passwordForm.reset();

          this.showPasswordSection = false;

          this.changingPassword = false;

        },


        error: (error) => {

          console.error(
            'Password change error:',
            error
          );


          this.errorMessage =
            error.error?.message ||
            error.error ||
            'Unable to change password.';


          this.changingPassword = false;

        }

      });

  }


  // ==========================================
  // TOGGLE PASSWORD SECTION
  // ==========================================

  togglePasswordSection(): void {

    this.showPasswordSection =
      !this.showPasswordSection;

    this.successMessage = '';

    this.errorMessage = '';

  }


  // ==========================================
  // BACK TO PROFILE
  // ==========================================

  goBackToProfile(): void {

    this.router.navigate([
      '/profile'
    ]);

  }

  openDeleteAccountModal(): void {

    this.showDeleteModal = true;

    this.deletePassword = '';

    this.deleteError = '';
  }

  closeDeleteAccountModal(): void {

    if (this.deletingAccount) {
      return;
    }

    this.showDeleteModal = false;

    this.deletePassword = '';

    this.deleteError = '';
  }

  deleteAccount(): void {

    // ------------------------------------------
    // Validate password
    // ------------------------------------------

    if (!this.deletePassword) {

      this.deleteError =
        'Please enter your current password.';

      return;
    }


    // ------------------------------------------
    // Start deleting
    // ------------------------------------------

    this.deletingAccount = true;

    this.deleteError = '';


    // ------------------------------------------
    // Call backend
    // ------------------------------------------

    this.profileService
      .deleteAccount(this.deletePassword)
      .subscribe({

        next: (response) => {

          this.deletingAccount = false;


          // --------------------------------------
          // Close modal
          // --------------------------------------

          this.showDeleteModal = false;


          // --------------------------------------
          // Remove stored user information
          // --------------------------------------

          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');


          // --------------------------------------
          // Redirect to login
          // --------------------------------------

          this.router.navigate(['/login']);

        },


        error: (error) => {

          console.error(
            'Delete account error:',
            error
          );


          this.deletingAccount = false;


          // --------------------------------------
          // Password incorrect
          // --------------------------------------

          if (error.status === 401) {

            this.deleteError =
              'Current password is incorrect.';

            return;
          }


          // --------------------------------------
          // User not found
          // --------------------------------------

          if (error.status === 404) {

            this.deleteError =
              'User account was not found.';

            return;
          }


          // --------------------------------------
          // Other backend errors
          // --------------------------------------

          this.deleteError =
            error.error?.message ||
            error.error ||
            'Unable to delete your account.';

        }

      });

  }

}