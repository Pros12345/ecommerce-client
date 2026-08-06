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

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EditProductService } from './edit-product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;
  productForm!: FormGroup;
  productId!: number;
  uploadSuccess = false;
  uploadError = '';
  selectedFiles: File[] = [];
  existingImages: any[] = [];
  deletedImageIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: EditProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
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
      ]
    });

    this.productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadProduct();

  }

  loadProduct(): void {

    this.productService
      .getProduct(this.productId)
      .subscribe({

        next: (product) => {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            price: product.price
          });

          this.existingImages = product.images;

        },

        error: err => {

          console.error(err);
          this.uploadError = 'Unable to load product';

        }

      });

  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }

  }

  removeNewImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach(file => {
      dataTransfer.items.add(file);

    });

    this.fileInput.nativeElement.files =
      dataTransfer.files;
    this.cdr.detectChanges();

  }

  removeExistingImage(image: any): void {

    this.deletedImageIds.push(image.id);
    this.existingImages =
      this.existingImages.filter(
        img => img.id !== image.id
      );

  }

  updateProduct(): void {
    if (!this.productForm.valid) {
      return;
    }

    this.productService.updateProduct(
      this.productId,
      this.productForm.value,
      this.selectedFiles,
      this.deletedImageIds,
    ).subscribe({

      next: () => {
        this.uploadSuccess = true;
        this.uploadError = '';
        alert('Product Updated Successfully');
        this.router.navigate(['/home']);
      },

      error: err => {
        console.error(err);
        this.uploadSuccess = false;
        this.uploadError = 'Unable to update product';
      }
    });
  }
}