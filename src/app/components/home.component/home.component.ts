import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../model/product';
import { ProductService } from '../../../model/product.service';
import { CartService } from '../cart.component/cart.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../authservice/authservice.component';
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
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.loadProducts();

  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = this.canAddProduct
          ? response
          : response.filter(product => product.status === 'Active');

        this.products = [...this.allProducts];
        this.products.forEach(product => {
          product.currentImageIndex = 0;
          (product as any).showMore = false;
        });

      },

      error: (error) => {
        console.error(error);
      }
    });
  }

  searchProducts(): void {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
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

    return `${environment.apiBaseUrl}/images/${product.images[product.currentImageIndex ?? 0].id}`;

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

  addToCart(product: Product) {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
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
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  get canAddProduct(): boolean {
    const email = localStorage.getItem('userEmail');
    return email?.toLowerCase().includes('prosenjit') ?? false;
  }

  deleteProduct(id: number): void {

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({

      next: () => {
        alert('Product deleted successfully');
        this.loadProducts();

      },

      error: (err) => {
        console.error(err);
        alert('Unable to delete product');

      }

    });

  }

  editProduct(id: number): void {

    this.router.navigate(
      ['/editProduct', id]
    );
  }
}