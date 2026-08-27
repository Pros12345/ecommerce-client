import {
    Component,
    ElementRef,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';

import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { ProductService } from './add-product.service';

import {
    RouterLink
} from '@angular/router';

import Swal from 'sweetalert2';


@Component({
    selector: 'app-add-product',
    standalone: true,

    imports: [
        ReactiveFormsModule,
        CommonModule,
        RouterLink
    ],

    templateUrl: './add-product.component.html',

    styleUrls: [
        './add-product.component.scss'
    ]
})


export class AddProductComponent {


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

    productForm: FormGroup;


    // ==========================================
    // SELECTED FILES
    // ==========================================

    selectedFiles: File[] = [];


    // ==========================================
    // PRIMARY IMAGE INDEX
    //
    // Example:
    // 0 = first image
    // 1 = second image
    // 2 = third image
    // ==========================================

    primaryImageIndex: number = 0;


    // ==========================================
    // STATUS
    // ==========================================

    uploadSuccess = false;

    uploadError = '';


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(

        private fb: FormBuilder,

        private productService:
            ProductService,

        private cdr:
            ChangeDetectorRef

    ) {


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
                        Validators.min(1)
                    ]
                ],

                price: [
                    1,
                    [
                        Validators.required,
                        Validators.min(1)
                    ]
                ]

            });

    }


    // ==========================================
    // FILE CHANGE
    // ==========================================

    onFileChange(
        event: Event
    ): void {


        const input =
            event.target as HTMLInputElement;


        if (
            input.files &&
            input.files.length > 0
        ) {


            this.selectedFiles =
                Array.from(
                    input.files
                );


            // ----------------------------------
            // First image becomes primary
            // by default
            // ----------------------------------

            this.primaryImageIndex = 0;


            this.uploadError = '';


            this.cdr.detectChanges();

        }

    }


    // ==========================================
    // SELECT PRIMARY IMAGE
    // ==========================================

    selectPrimaryImage(
        index: number
    ): void {


        if (
            index < 0 ||
            index >= this.selectedFiles.length
        ) {

            return;

        }


        this.primaryImageIndex =
            index;


        console.log(
            'Primary image index:',
            this.primaryImageIndex
        );


        console.log(
            'Primary image:',
            this.selectedFiles[
                this.primaryImageIndex
            ]?.name
        );

    }


    // ==========================================
    // GET FILE PREVIEW
    //
    // This replaces the missing
    // filePreview pipe.
    // ==========================================

    getFilePreview(
        file: File
    ): string {

        return URL.createObjectURL(
            file
        );

    }


    // ==========================================
    // REMOVE IMAGE
    // ==========================================

    removeImage(
        index: number
    ): void {


        if (
            index < 0 ||
            index >= this.selectedFiles.length
        ) {

            return;

        }


        const wasPrimary =
            this.primaryImageIndex === index;


        // --------------------------------------
        // Remove file
        // --------------------------------------

        this.selectedFiles.splice(
            index,
            1
        );


        // --------------------------------------
        // Adjust primary image
        // --------------------------------------

        if (
            this.selectedFiles.length === 0
        ) {

            this.primaryImageIndex = 0;

        }


        else if (wasPrimary) {

            // If primary image was deleted,
            // first remaining image becomes primary

            this.primaryImageIndex = 0;

        }


        else if (
            index < this.primaryImageIndex
        ) {

            // If an image before the primary
            // was deleted, adjust index

            this.primaryImageIndex--;

        }


        // --------------------------------------
        // Update native file input
        // --------------------------------------

        if (
            this.fileInput?.nativeElement
        ) {


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
    // SUBMIT
    // ==========================================

    onSubmit(): void {


        // --------------------------------------
        // Reset previous messages
        // --------------------------------------

        this.uploadSuccess = false;

        this.uploadError = '';


        // --------------------------------------
        // Validate form
        // --------------------------------------

        if (
            this.productForm.invalid
        ) {

            this.productForm.markAllAsTouched();

            return;

        }


        // --------------------------------------
        // Validate images
        // --------------------------------------

        if (
            this.selectedFiles.length === 0
        ) {

            this.uploadError =
                'Please select at least one image.';

            return;

        }


        // --------------------------------------
        // Make sure primary index is valid
        // --------------------------------------

        if (
            this.primaryImageIndex < 0 ||
            this.primaryImageIndex >=
            this.selectedFiles.length
        ) {

            this.primaryImageIndex = 0;

        }


        // --------------------------------------
        // Product data
        // --------------------------------------

        const productData = {

            ...this.productForm.value,

            primaryImageIndex:
                this.primaryImageIndex

        };


        console.log(
            'Product Data:',
            productData
        );


        console.log(
            'Primary Image:',
            this.selectedFiles[
                this.primaryImageIndex
            ]?.name
        );


        // --------------------------------------
        // API CALL
        // --------------------------------------

        this.productService
            .addProduct(
                productData,
                this.selectedFiles
            )
            .subscribe({

                next: response => {


                    console.log(
                        'Product added:',
                        response
                    );


                    // ----------------------------------
                    // Clear inline messages
                    // ----------------------------------

                    this.uploadSuccess = false;

                    this.uploadError = '';


                    // ----------------------------------
                    // Reset form
                    // ----------------------------------

                    this.productForm.reset({

                        name: '',

                        description: '',

                        quantity: 1,

                        price: 1

                    });


                    // ----------------------------------
                    // Clear selected files
                    // ----------------------------------

                    this.selectedFiles = [];


                    // ----------------------------------
                    // Reset primary image
                    // ----------------------------------

                    this.primaryImageIndex = 0;


                    // ----------------------------------
                    // Reset file input
                    // ----------------------------------

                    if (
                        this.fileInput?.nativeElement
                    ) {

                        this.fileInput
                            .nativeElement
                            .value = '';

                    }


                    this.cdr.detectChanges();


                    // ----------------------------------
                    // SUCCESS POPUP
                    // ----------------------------------

                    Swal.fire({

                        title: 'Success!',

                        text: 'Product Added Successfully',

                        icon: 'success',

                        confirmButtonText: 'OK',

                        confirmButtonColor: '#2874f0',

                        allowOutsideClick: false,

                        allowEscapeKey: false

                    });

                },


                error: err => {


                    console.error(
                        'Error adding product:',
                        err
                    );


                    this.uploadSuccess = false;


                    this.uploadError =
                        err?.error?.message
                        ||
                        'Error uploading product!';

                }

            });

    }

}