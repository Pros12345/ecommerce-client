import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ProfileService } from './profile.component.service';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;

  passwordForm!: FormGroup;

  loading = false;

  savingProfile = false;

  changingPassword = false;

  showPasswordSection = false;

  showCurrentPassword = false;

  showNewPassword = false;

  showConfirmPassword = false;

  successMessage = '';

  errorMessage = '';


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


  loadProfile(): void {

    this.loading = true;

    this.profileService.getProfile().subscribe({

      next: (profile) => {

        console.log('Profile:', profile);

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


  updateProfile(): void {

    if (this.profileForm.invalid) {

      this.profileForm.markAllAsTouched();

      return;
    }

    this.savingProfile = true;

    this.successMessage = '';

    this.errorMessage = '';


    this.profileService
      .updateProfile(this.profileForm.value)
      .subscribe({

        next: (response) => {

          console.log(
            'Profile updated:',
            response
          );


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


          this.successMessage =
            'Profile updated successfully.';

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

          console.log('Password change response:', response);

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


  togglePasswordSection(): void {

    this.showPasswordSection =
      !this.showPasswordSection;

    this.successMessage = '';

    this.errorMessage = '';
  }


  goHome(): void {

    this.router.navigate(['/home']);

  }


  logout(): void {

    localStorage.removeItem('authToken');

    localStorage.removeItem('userEmail');

    localStorage.removeItem('userName');

    this.router.navigate(['/login']);

  }

}