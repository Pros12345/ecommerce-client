import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from './add-product.service';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
    productForm: FormGroup;
    selectedFile: File | null = null;
    uploadSuccess = false;
    uploadError = '';

    constructor(
        private fb: FormBuilder,
        private productService: ProductService
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
        if (input.files?.length) {
            this.selectedFile = input.files[0];
        }
    }

    onSubmit(): void {
        if (this.productForm.valid && this.selectedFile) {
            this.productService.addProduct(this.productForm.value, this.selectedFile).subscribe({
                next: () => {
                    this.uploadSuccess = true;
                    this.uploadError = '';
                    this.productForm.reset();
                    this.selectedFile = null;
                },
                error: err => {
                    this.uploadSuccess = false;
                    this.uploadError = 'Error uploading product!';
                    console.error(err);
                }
            });
        }
    }
}
