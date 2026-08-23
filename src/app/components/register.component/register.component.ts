import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value === confirmPassword.value) {
    return null;
  }

  return { passwordsMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.registrationForm = this.fb.group({

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

    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {

    if (this.registrationForm.valid) {

      this.http.post(
        `${environment.apiBaseUrl}/users/register`,
        this.registrationForm.value
      )
        .subscribe({

          next: (response) => {

            console.log(
              'User registered:',
              response
            );

            alert('Registration successful!');

            this.router.navigate(['/login']);
          },

          error: (err) => {

            console.error('Registration error:', err);

            let errorMessage = 'Something went wrong!';

            if (err.error?.message) {

              errorMessage = err.error.message;

            } else if (typeof err.error === 'string') {

              errorMessage = err.error;

            }

            this.showErrorPopup(errorMessage);
          }

        });

    } else {

      this.registrationForm.markAllAsTouched();

      console.log(
        'Form is invalid.'
      );
    }
  }

  showErrorPopup(message: string): void {

    this.errorMessage = message;
    this.showError = true;

  }

  closeErrorPopup(): void {

    this.showError = false;
    this.errorMessage = '';

  }

}
