import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({

  selector: 'app-login',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.scss']

})
export class LoginComponent {

  loginForm: FormGroup;
  showLoginPassword = false;

  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }
  // ==============================
  // ERROR POPUP
  // ==============================

  showErrorPopup: boolean = false;

  errorMessage: string = '';


  constructor(

    private fb: FormBuilder,

    private http: HttpClient,

    private router: Router

  ) {

    this.loginForm = this.fb.group({

      identifier: [

        '',

        Validators.required

      ],

      password: [

        '',

        Validators.required

      ]

    });

  }


  onLogin(): void {

    // ==============================
    // FORM VALIDATION
    // ==============================

    if (!this.loginForm.valid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    // ==============================
    // LOGIN REQUEST
    // ==============================

    const loginRequest = {

      identifier:
        this.loginForm.value.identifier.trim(),

      password:
        this.loginForm.value.password

    };


    console.log(
      'Login Request:',
      loginRequest
    );


    // ==============================
    // API CALL
    // ==============================

    this.http.post<any>(

      `${environment.apiBaseUrl}/auth/login`,

      loginRequest,

      {
        responseType: 'json'
      }

    )
      .subscribe({

        // ==============================
        // SUCCESS
        // ==============================

        next: (response) => {

          console.log(
            'Login successful:',
            response
          );


          // JWT TOKEN

          localStorage.setItem(

            'authToken',

            response.token

          );


          // USER EMAIL / LOGIN IDENTIFIER

          localStorage.setItem(

            'userEmail',

            loginRequest.identifier

          );


          localStorage.setItem(

            'loginIdentifier',

            loginRequest.identifier

          );


          // USER NAME

          localStorage.setItem(

            'userName',

            response.firstName

          );


          // NAVIGATE TO HOME

          this.router.navigate([

            '/home'

          ]);

        },


        // ==============================
        // ERROR
        // ==============================

        error: (err) => {

          console.error(

            'Login error:',

            err

          );


          // Error message for popup

          this.errorMessage =

            'Invalid email/mobile number or password';


          // Show custom popup

          this.showErrorPopup = true;

        }

      });

  }


  // ==============================
  // CLOSE ERROR POPUP
  // ==============================

  closeErrorPopup(): void {

    this.showErrorPopup = false;

  }

}