import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  products = [
    { id: 1, name: 'iPhone 15', price: 79999 },
    { id: 2, name: 'Samsung Galaxy S24', price: 69999 },
    { id: 3, name: 'Redmi Note 13', price: 19999 }
  ];
  categories: any;
  featuredProducts: any;
  router: any;

  // Check if the user is logged in by presence of token in localStorage
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  onLogout(): void {
    localStorage.removeItem('authToken');
    // Optionally navigate to login, or reload page for UI refresh
    this.router.navigate(['/login']);
  }
}

