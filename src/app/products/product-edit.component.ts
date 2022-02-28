import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  pageTitle = 'Product Edit';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    // Defines all of the validation messages for the form.
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
      starRating: ['', Validators.required],
      Discription: '',
    });

    // Reacd the product Id from route parameters
    // this.sub = this.route.paramMap.subscribe((params) => {
    //   const id = +params.get('id');
    //   this.getProduct(id); //
    // });
  }

  saveProduct() {}
  deleteProduct() {}
}
