import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  constructor(
    private router: Router
  ) { }

  goHome(): void {
    this.router.navigate(['/home']);
  }

}