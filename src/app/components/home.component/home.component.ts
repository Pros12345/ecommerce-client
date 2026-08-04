import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../model/product';
import { ProductService } from '../../../model/product.service';
import { CartService } from '../cart.component/cart.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  categories: any;
  featuredProducts: any;

  products: Product[] = [];
  allProducts: Product[] = [];
  searchText: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {

    this.loadProducts();

  }

  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (response) => {

        this.allProducts = response;
        this.products = [...response];
        this.products.forEach(product => {
          product.currentImageIndex = 0;
        });
        console.log(this.products);

      },

      error: (error) => {
        console.error(error);

      }

    });

  }

  searchProducts(): void {

    const keyword = this.searchText.trim().toLowerCase();
    if (keyword === '') {
      this.products = [...this.allProducts];
      return;
    }

    this.products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword)
    );

  }

  getCurrentImage(product: Product): string {

    if (!product.images || product.images.length === 0) {
      return 'assets/no-image.png';

    }

    return `${environment.apiBaseUrl}/api/images/${product.images[product.currentImageIndex ?? 0].id}`;

  }

  nextImage(product: Product): void {

    if (!product.images || product.images.length <= 1) {
      return;
    }

    product.currentImageIndex =
      ((product.currentImageIndex ?? 0) + 1)
      % product.images.length;

  }

  previousImage(product: Product): void {

    if (!product.images || product.images.length <= 1) {
      return;

    }

    product.currentImageIndex =
      ((product.currentImageIndex ?? 0) - 1 + product.images.length)
      % product.images.length;

  }

  setCurrentImage(product: Product, index: number): void {

    product.currentImageIndex = index;

  }

  addToCart(product: Product): void {

    if (this.cartService.isInCart(product.id)) {
      this.router.navigate(['/cart']);
      return;

    }

    this.cartService.addToCart(product);

  }

  isAdded(product: Product): boolean {

    return this.cartService.isInCart(product.id);

  }

  get isLoggedIn(): boolean {

    return !!localStorage.getItem('authToken');

  }

  onLogout(): void {

    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);

  }

}