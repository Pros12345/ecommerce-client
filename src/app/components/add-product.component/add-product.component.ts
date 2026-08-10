import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from './add-product.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
})

export class AddProductComponent {

    @ViewChild('fileInput', { static: false })
    fileInput!: ElementRef<HTMLInputElement>;

    productForm: FormGroup;
    selectedFiles: File[] = [];
    uploadSuccess = false;
    uploadError = '';

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private cdr: ChangeDetectorRef
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            quantity: [1, [Validators.required, Validators.min(1)]],
            price: [1, [Validators.required, Validators.min(1)]]
        });
    }

    onFileChange(event: Event): void {

        const input = event.target as HTMLInputElement;

        if (input.files) {

            this.selectedFiles = Array.from(input.files);

        }

    }

    removeImage(index: number): void {

        console.log("Before:", this.selectedFiles.length);

        this.selectedFiles.splice(index, 1);

        console.log("After:", this.selectedFiles.length);

        const dataTransfer = new DataTransfer();

        this.selectedFiles.forEach(file => {
            dataTransfer.items.add(file);
        });

        console.log(this.fileInput);
        this.fileInput.nativeElement.files = dataTransfer.files;
        this.cdr.detectChanges();

        console.log("Input files:", this.fileInput.nativeElement.files?.length);
    }

    onSubmit(): void {
        if (this.productForm.valid && this.selectedFiles.length > 0)
            this.productService.addProduct(
                this.productForm.value,
                this.selectedFiles
            ).subscribe({
                next: () => {
                    this.uploadSuccess = true;
                    this.uploadError = '';
                    this.productForm.reset();
                    this.selectedFiles = [];
                },
                error: err => {
                    this.uploadSuccess = false;
                    this.uploadError = 'Error uploading product!';
                    console.error(err);
                }
            });
    }
}

