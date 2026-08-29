import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  RouterModule,
  Router
} from '@angular/router';

import {
  environment
} from '../../../environments/environment';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';


/* ==========================================
   PASSWORD MATCH VALIDATOR
========================================== */

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password =
    control.get('password');

  const confirmPassword =
    control.get('confirmPassword');


  if (
    !password ||
    !confirmPassword
  ) {

    return null;

  }


  if (
    password.value ===
    confirmPassword.value
  ) {

    return null;

  }


  return {
    passwordsMismatch: true
  };

};


@Component({

  selector: 'app-register',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],

  templateUrl:
    './register.component.html',

  styleUrls: [
    './register.component.scss'
  ]

})


export class RegisterComponent
  implements OnInit {


  /* ==========================================
     FORM
  ========================================== */

  registrationForm!: FormGroup;


  /* ==========================================
     ERROR POPUP
  ========================================== */

  showError: boolean = false;

  errorMessage: string = '';


  /* ==========================================
     SUCCESS POPUP
  ========================================== */

  showSuccess: boolean = false;

  successMessage: string = '';


  /* ==========================================
     PASSWORD VISIBILITY
  ========================================== */

  showRegistrationPassword =
    false;

  showConfirmPassword =
    false;


  /* ==========================================
     TOGGLE REGISTRATION PASSWORD
  ========================================== */

  toggleRegistrationPassword(): void {

    this.showRegistrationPassword =
      !this.showRegistrationPassword;

  }


  /* ==========================================
     TOGGLE CONFIRM PASSWORD
  ========================================== */

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }


  /* ==========================================
     CONSTRUCTOR
  ========================================== */

  constructor(

    private fb: FormBuilder,

    private http: HttpClient,

    private router: Router

  ) { }


  /* ==========================================
     INIT
  ========================================== */

  ngOnInit(): void {

    this.registrationForm =
      this.fb.group({

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

            Validators.pattern(
              /^[0-9]{10}$/
            )

          ]

        ],


        password: [

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

      },

        {

          validators:
            passwordMatchValidator

        });

  }


  /* ==========================================
     SUBMIT REGISTRATION
  ========================================== */

  onSubmit(): void {


    /* ========================================
       VALIDATION
    ======================================== */

    if (
      !this.registrationForm.valid
    ) {

      this.registrationForm
        .markAllAsTouched();


      return;

    }


    /* ========================================
       API CALL
    ======================================== */

    this.http.post(

      `${environment.apiBaseUrl}/users/register`,

      this.registrationForm.value

    )

      .subscribe({

        /* ======================================
           SUCCESS
        ====================================== */

        next: (
          response: any
        ) => {


          this.successMessage =
            response?.message ||
            'Your account has been created successfully.';

          this.showSuccess =
            true;

        },


        /* ======================================
           ERROR
        ====================================== */

        error: (
          err
        ) => {

          console.error(
            'Registration error:',
            err
          );


          let errorMessage =
            'Registration failed. Please try again.';


          /* ====================================
             BACKEND MESSAGE
          ==================================== */

          if (
            err.error?.message
          ) {

            errorMessage =
              err.error.message;

          }


          /* ====================================
             STRING RESPONSE
          ==================================== */

          else if (
            typeof err.error ===
            'string'
          ) {

            errorMessage =
              err.error;

          }


          /* ====================================
             CONFLICT
          ==================================== */

          else if (
            err.status === 409
          ) {

            errorMessage =
              'An account with this email already exists.';

          }


          /* ====================================
             BAD REQUEST
          ==================================== */

          else if (
            err.status === 400
          ) {

            errorMessage =
              'Please check your registration details.';

          }


          /* ====================================
             SERVER ERROR
          ==================================== */

          else if (
            err.status === 500
          ) {

            errorMessage =
              'Server error. Please try again later.';

          }


          /* ====================================
             SHOW ERROR POPUP
          ==================================== */

          this.showErrorPopup(
            errorMessage
          );

        }

      });

  }


  /* ==========================================
     SHOW ERROR POPUP
  ========================================== */

  showErrorPopup(
    message: string
  ): void {

    this.errorMessage =
      message;

    this.showError =
      true;

  }


  /* ==========================================
     CLOSE ERROR POPUP
  ========================================== */

  closeErrorPopup(): void {

    this.showError =
      false;

    this.errorMessage =
      '';

  }


  /* ==========================================
     CLOSE SUCCESS POPUP
  ========================================== */

  closeSuccessPopup(): void {

    this.showSuccess =
      false;

    this.successMessage =
      '';


    /* ========================================
       GO TO LOGIN
    ======================================== */

    this.router.navigate([
      '/login'
    ]);

  }

}