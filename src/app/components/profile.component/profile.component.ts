import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterModule
} from '@angular/router';


@Component({

  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './profile.component.html',

  styleUrls: ['./profile.component.scss']

})


export class ProfileComponent {


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private router: Router
  ) { }


  // ==========================================
  // GO TO HOME
  // ==========================================

  goHome(): void {

    this.router.navigate([
      '/home'
    ]);

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  onLogout(): void {

    // Remove authentication data

    localStorage.removeItem(
      'authToken'
    );

    localStorage.removeItem(
      'userEmail'
    );

    localStorage.removeItem(
      'userName'
    );


    // Redirect to login page

    this.router.navigate([
      '/login'
    ]);

  }

}