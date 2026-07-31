import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Product } from '../../../model/product';
import { ProductService } from '../../../model/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  categories: any;
  featuredProducts: any;

  // Products from backend
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadProducts();

  }

  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (response) => {

        this.products = response;
        console.log(response);

      },

      error: (error) => {

        console.error(error);

      }

    });

  }

  get isLoggedIn(): boolean {

    return !!localStorage.getItem('authToken');

  }

  onLogout(): void {

    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);

  }

}   