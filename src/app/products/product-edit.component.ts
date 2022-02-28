import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './product.service';
import { GenericValidator } from '../shared/generic-validator';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { NumberValidators } from '../shared/number.validator';
import { debounceTime } from 'rxjs/operators';
import { Product } from './product';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  errorMessage!: string;
  productForm!: FormGroup;
  pageTitle = 'Product Edit';
  product!: Product;
  private sub!: Subscription;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    // Defines all of the validation messages for the form.
    this.validationMessages = {
      productName: {
        required: 'Product Name is Required',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.',
      },
      productCode: {
        required: 'Product code is required.',
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).',
      },
    };

    // Define the validation instance and pass the validation messages to the form
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      description: '',
    });

    //Read the product Id from route parameters
    this.sub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.getProduct(+id);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );
    merge(this.productForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.productForm
        );
      });
  }

  getProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => this.displayProduct(product),
      error: (err) => (this.errorMessage = err),
    });
  }

  displayProduct(product: Product) {
    if (this.productForm) {
      this.productForm.reset();
    }

    this.product = product;
    if (this.product.id === 0) {
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product : ${this.product.productName}`;
    }
    this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description,
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      const p = { ...this.product, ...this.productForm.value };
      // if(p.id === 0){
      //   this.productService.
      // }
      this.productService.updateProduct(p).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => (this.errorMessage = err),
      });
    }
  }

  onSaveComplete() {
    // reset the form and navigate to products page
    this.productForm.reset();
    this.router.navigate(['/products']);
  }
  deleteProduct() {}
}
