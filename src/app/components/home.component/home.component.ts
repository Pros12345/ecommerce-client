import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Product } from '../../../model/product';
import { ProductService } from '../../../model/product.service';
import { CartService } from '../cart.component/cart.service';
import { AuthService } from '../authservice/authservice.component';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],

  templateUrl: './home.component.html',

  styleUrls: [
    './home.component.scss'
  ]
})


export class HomeComponent implements OnInit {


  // ==========================================
  // VARIABLES
  // ==========================================

  categories: any;

  featuredProducts: any;

  products: Product[] = [];

  allProducts: Product[] = [];

  searchText: string = '';



  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private productService: ProductService,

    private router: Router,

    private cartService: CartService,

    private authService: AuthService

  ) { }



  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    this.loadProducts();

  }



  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  loadProducts(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (response) => {


          this.allProducts = this.canAddProduct

            ? response

            : response.filter(
              product =>
                product.status === 'Active'
            );


          this.products = [
            ...this.allProducts
          ];


          this.products.forEach(
            product => {

              product.currentImageIndex = 0;

              (product as any).showMore = false;

            }
          );

        },


        error: (error) => {

          console.error(
            'Error loading products:',
            error
          );

        }

      });

  }



  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  searchProducts(): void {

    const keyword =
      this.searchText
        .trim()
        .toLowerCase();


    if (!keyword) {

      this.products = [
        ...this.allProducts
      ];

      return;

    }


    this.products =
      this.allProducts.filter(
        product =>

          product.name
            .toLowerCase()
            .includes(keyword)

          ||

          product.description
            .toLowerCase()
            .includes(keyword)
      );

  }



  // ==========================================
  // GET CURRENT IMAGE
  // ==========================================

  getCurrentImage(
    product: Product
  ): string {


    if (
      !product.images ||
      product.images.length === 0
    ) {

      return 'assets/no-image.png';

    }


    return `${environment.apiBaseUrl}/images/${product.images[product.currentImageIndex ?? 0].id}`;

  }



  // ==========================================
  // NEXT IMAGE
  // ==========================================

  nextImage(
    product: Product
  ): void {


    if (
      !product.images ||
      product.images.length <= 1
    ) {

      return;

    }


    product.currentImageIndex =

      (
        (product.currentImageIndex ?? 0) + 1
      )

      %

      product.images.length;

  }



  // ==========================================
  // PREVIOUS IMAGE
  // ==========================================

  previousImage(
    product: Product
  ): void {


    if (
      !product.images ||
      product.images.length <= 1
    ) {

      return;

    }


    product.currentImageIndex =

      (
        (product.currentImageIndex ?? 0) - 1
        + product.images.length
      )

      %

      product.images.length;

  }



  // ==========================================
  // SET IMAGE
  // ==========================================

  setCurrentImage(
    product: Product,
    index: number
  ): void {

    product.currentImageIndex = index;

  }



  // ==========================================
  // ADD TO CART
  // ==========================================

  addToCart(
    product: Product
  ): void {


    if (
      !this.authService.isLoggedIn()
    ) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    this.cartService.addToCart(
      product
    );

  }



  // ==========================================
  // CHECK PRODUCT IN CART
  // ==========================================

  isAdded(
    product: Product
  ): boolean {

    return this.cartService
      .isInCart(product.id);

  }



  // ==========================================
  // LOGIN STATUS
  // ==========================================

  get isLoggedIn(): boolean {

    return !!localStorage.getItem(
      'authToken'
    );

  }



  // ==========================================
  // USER NAME
  // ==========================================

  get userName(): string {

    return (
      localStorage.getItem(
        'userName'
      ) || 'User'
    );

  }



  // ==========================================
  // USER EMAIL
  // ==========================================

  get userEmail(): string {

    return (
      localStorage.getItem(
        'userEmail'
      ) || ''
    );

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


    // Navigate to login

    this.router.navigate([
      '/login'
    ]);

  }



  // ==========================================
  // ADMIN CHECK
  // ==========================================

  get canAddProduct(): boolean {

    const email =
      localStorage.getItem(
        'userEmail'
      );


    return (
      email
        ?.toLowerCase()
        .includes('prosenjit')
      ?? false
    );

  }



  // ==========================================
  // PERMANENT DELETE PERMISSION
  // ==========================================

  get canPermanentlyDelete(): boolean {

    const email =
      localStorage.getItem(
        'userEmail'
      );


    return (
      email
        ?.toLowerCase()
        .includes(
          'prosenjitchakrabortty'
        )
      ?? false
    );

  }



  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  deleteProduct(
    id: number
  ): void {


    if (
      !confirm(
        'Are you sure you want to delete this product?'
      )
    ) {

      return;

    }


    this.productService
      .deleteProduct(id)
      .subscribe({

        next: () => {


          alert(
            'Product deleted successfully'
          );


          this.loadProducts();

        },


        error: (err) => {


          console.error(
            err
          );


          alert(
            'Unable to delete product'
          );

        }

      });

  }



  // ==========================================
  // PERMANENT DELETE
  // ==========================================

  permanentlyDeleteProduct(
    id: number
  ): void {


    Swal.fire({

      title: 'Are you sure?',

      text:
        'This product and its images will be permanently deleted.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes',

      cancelButtonText: 'No',

      confirmButtonColor: '#d33',

      cancelButtonColor: '#6c757d',

      reverseButtons: true

    })

      .then((result) => {


        if (
          result.isConfirmed
        ) {


          this.productService
            .permanentlyDeleteProduct(id)
            .subscribe({

              next: () => {


                Swal.fire({

                  title: 'Deleted!',

                  text:
                    'Product permanently deleted successfully.',

                  icon: 'success',

                  confirmButtonColor:
                    '#3085d6'

                });


                this.loadProducts();

              },


              error: (err) => {


                console.error(
                  'Permanent delete error:',
                  err
                );


                Swal.fire({

                  title: 'Error',

                  text:
                    'Unable to permanently delete product.',

                  icon: 'error'

                });

              }

            });

        }

      });

  }



  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  editProduct(
    id: number
  ): void {

    this.router.navigate(
      [
        '/editProduct',
        id
      ]
    );

  }

}