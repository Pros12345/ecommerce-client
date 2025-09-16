import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.http.post('http://localhost:8080/api/users/register', this.registrationForm.value)
        .subscribe({
          next: (response) => {
            console.log('User registered:', response);
            alert('Registration successful!');
            this.registrationForm.reset();
          },
          error: (err) => {
            console.error('Error occurred:', err);
            alert('Something went wrong!');
          }
        });
    } else {
      console.log('Form is invalid.');
    }
  }
}
