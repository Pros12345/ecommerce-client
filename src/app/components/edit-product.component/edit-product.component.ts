import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import Swal from 'sweetalert2';

import {
  EditProductService
} from './edit-product.service';


@Component({

  selector: 'app-edit-product',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl:
    './edit-product.component.html',

  styleUrls: [
    './edit-product.component.scss'
  ]

})


export class EditProductComponent
  implements OnInit {


  // ==========================================
  // FILE INPUT
  // ==========================================

  @ViewChild(
    'fileInput',
    { static: false }
  )
  fileInput!: ElementRef<HTMLInputElement>;


  // ==========================================
  // FORM
  // ==========================================

  productForm!: FormGroup;


  // ==========================================
  // PRODUCT ID
  // ==========================================

  productId!: number;


  // ==========================================
  // SUCCESS / ERROR
  // ==========================================

  uploadSuccess = false;

  uploadError = '';


  // ==========================================
  // IMAGES
  // ==========================================

  selectedFiles: File[] = [];

  existingImages: any[] = [];

  deletedImageIds: number[] = [];


  // ==========================================
  // PRIMARY IMAGE
  //
  // Example:
  //
  // existing:15
  // new:2
  // ==========================================

  selectedPrimaryKey = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router,

    private productService:
      EditProductService,

    private cdr:
      ChangeDetectorRef

  ) { }


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.productForm =
      this.fb.group({

        name: [
          '',
          Validators.required
        ],

        description: [
          ''
        ],

        quantity: [

          1,

          [
            Validators.required,
            Validators.min(0)
          ]

        ],

        price: [

          1,

          [
            Validators.required,
            Validators.min(1)
          ]

        ],

        status: [

          'Active',

          Validators.required

        ]

      });


    // ======================================
    // GET PRODUCT ID FROM URL
    // ======================================

    this.productId =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('id')
      );


    // ======================================
    // LOAD PRODUCT
    // ======================================

    this.loadProduct();

  }


  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  loadProduct(): void {

    this.productService
      .getProduct(this.productId)
      .subscribe({

        next: product => {


          // ==================================
          // PATCH PRODUCT DATA
          // ==================================

          this.productForm.patchValue({

            name:
              product.name,

            description:
              product.description,

            quantity:
              product.quantity,

            price:
              product.price,

            status:
              product.status

          });


          // ==================================
          // LOAD EXISTING IMAGES
          // ==================================

          this.existingImages =
            product.images || [];


          // ==================================
          // FIND PRIMARY IMAGE
          // ==================================

          const primary =
            this.existingImages.find(

              image =>
                image.primaryImage === true

            );


          if (primary) {

            this.selectedPrimaryKey =
              `existing:${primary.id}`;

          }

          else if (
            this.existingImages.length > 0
          ) {

            this.selectedPrimaryKey =
              `existing:${this.existingImages[0].id}`;

          }


          this.cdr.detectChanges();

        },


        error: err => {

          console.error(
            'Unable to load product:',
            err
          );


          this.uploadError =
            'Unable to load product';

        }

      });

  }


  // ==========================================
  // GET FILE PREVIEW
  // ==========================================

  getFilePreview(
    file: File
  ): string {

    return URL.createObjectURL(file);

  }


  // ==========================================
  // SELECT EXISTING PRIMARY IMAGE
  // ==========================================

  selectExistingPrimary(
    imageId: number
  ): void {

    this.selectedPrimaryKey =
      `existing:${imageId}`;

  }


  // ==========================================
  // SELECT NEW PRIMARY IMAGE
  // ==========================================

  selectNewPrimary(
    index: number
  ): void {

    this.selectedPrimaryKey =
      `new:${index}`;

  }


  // ==========================================
  // NEW FILE CHANGE
  // ==========================================

  onFileChange(
    event: Event
  ): void {


    const input =
      event.target as HTMLInputElement;


    if (
      input &&
      input.files &&
      input.files.length > 0
    ) {

      this.selectedFiles =
        Array.from(
          input.files
        );


      // ==================================
      // IF THERE IS NO PRIMARY IMAGE
      // SELECT FIRST NEW IMAGE
      // ==================================

      if (
        !this.selectedPrimaryKey &&
        this.selectedFiles.length > 0
      ) {

        this.selectedPrimaryKey =
          'new:0';

      }

    }

  }


  // ==========================================
  // REMOVE NEW IMAGE
  // ==========================================

  removeNewImage(
    index: number
  ): void {


    const removedWasPrimary =
      this.selectedPrimaryKey ===
      `new:${index}`;


    // ======================================
    // REMOVE FILE
    // ======================================

    this.selectedFiles.splice(
      index,
      1
    );


    // ======================================
    // ADJUST PRIMARY IMAGE
    // ======================================

    if (removedWasPrimary) {


      if (
        this.selectedFiles.length > 0
      ) {

        this.selectedPrimaryKey =
          'new:0';

      }

      else {

        const firstExisting =
          this.existingImages[0];


        if (firstExisting) {

          this.selectedPrimaryKey =
            `existing:${firstExisting.id}`;

        }

        else {

          this.selectedPrimaryKey =
            '';

        }

      }

    }

    else if (
      this.selectedPrimaryKey
        .startsWith('new:')
    ) {


      const currentIndex =
        Number(
          this.selectedPrimaryKey
            .split(':')[1]
        );


      if (
        index < currentIndex
      ) {

        this.selectedPrimaryKey =
          `new:${currentIndex - 1}`;

      }

    }


    // ======================================
    // UPDATE FILE INPUT
    // ======================================

    if (this.fileInput) {

      const dataTransfer =
        new DataTransfer();


      this.selectedFiles.forEach(
        file => {

          dataTransfer.items.add(
            file
          );

        }
      );


      this.fileInput
        .nativeElement
        .files =
        dataTransfer.files;

    }


    this.cdr.detectChanges();

  }


  // ==========================================
  // REMOVE EXISTING IMAGE
  // ==========================================

  removeExistingImage(
    image: any
  ): void {


    const wasPrimary =
      this.selectedPrimaryKey ===
      `existing:${image.id}`;


    // ======================================
    // ADD IMAGE ID TO DELETE LIST
    // ======================================

    this.deletedImageIds.push(
      image.id
    );


    // ======================================
    // REMOVE FROM UI
    // ======================================

    this.existingImages =
      this.existingImages.filter(

        img =>
          img.id !== image.id

      );


    // ======================================
    // SELECT NEW PRIMARY
    // ======================================

    if (wasPrimary) {


      const firstExisting =
        this.existingImages[0];


      if (firstExisting) {

        this.selectedPrimaryKey =
          `existing:${firstExisting.id}`;

      }

      else if (
        this.selectedFiles.length > 0
      ) {

        this.selectedPrimaryKey =
          'new:0';

      }

      else {

        this.selectedPrimaryKey =
          '';

      }

    }

  }


  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  updateProduct(): void {


    // ======================================
    // RESET MESSAGES
    // ======================================

    this.uploadError = '';

    this.uploadSuccess = false;


    // ======================================
    // VALIDATE FORM
    // ======================================

    if (
      !this.productForm.valid
    ) {

      this.productForm.markAllAsTouched();

      return;

    }


    // ======================================
    // CHECK IMAGES
    // ======================================

    if (

      this.existingImages.length === 0

      &&

      this.selectedFiles.length === 0

    ) {

      this.uploadError =
        'Product must have at least one image.';

      return;

    }


    // ======================================
    // PRIMARY IMAGE DATA
    // ======================================

    let primaryImageId:
      number | null = null;


    let primaryNewImageIndex:
      number | null = null;


    // ======================================
    // EXISTING PRIMARY
    // ======================================

    if (
      this.selectedPrimaryKey
        .startsWith('existing:')
    ) {


      primaryImageId =
        Number(
          this.selectedPrimaryKey
            .split(':')[1]
        );

    }


    // ======================================
    // NEW PRIMARY
    // ======================================

    else if (
      this.selectedPrimaryKey
        .startsWith('new:')
    ) {


      primaryNewImageIndex =
        Number(
          this.selectedPrimaryKey
            .split(':')[1]
        );

    }


    // ======================================
    // PRODUCT DATA
    // ======================================

    const productData = {

      ...this.productForm.value,

      primaryImageId,

      primaryNewImageIndex

    };


    // ======================================
    // UPDATE PRODUCT
    // ======================================

    this.productService
      .updateProduct(

        this.productId,

        productData,

        this.selectedFiles,

        this.deletedImageIds

      )
      .subscribe({

        // ==================================
        // SUCCESS
        // ==================================

        next: () => {


          this.uploadSuccess =
            true;

          this.uploadError =
            '';


          // ==================================
          // SWEETALERT SUCCESS MESSAGE
          // ==================================

          Swal.fire({

            title:
              'Success!',

            text:
              'Product updated successfully.',

            icon:
              'success',

            confirmButtonText:
              'OK',

            confirmButtonColor:
              '#3085d6',

            allowOutsideClick:
              false,

            allowEscapeKey:
              false

          })
            .then(() => {


              // ==================================
              // AFTER OK -> HOME
              // ==================================

              this.router.navigate([
                '/home'
              ]);

            });

        },


        // ==================================
        // ERROR
        // ==================================

        error: err => {


          console.error(
            'Update product error:',
            err
          );


          this.uploadSuccess =
            false;


          this.uploadError =
            err?.error?.message
            ||
            'Unable to update product';


          // ==================================
          // SWEETALERT ERROR
          // ==================================

          Swal.fire({

            title:
              'Update Failed',

            text:
              this.uploadError,

            icon:
              'error',

            confirmButtonText:
              'OK',

            confirmButtonColor:
              '#d33'

          });

        }

      });

  }

}