import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private productId: string;
  private authStatusSub: Subscription;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      royalexId: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('^[0-9]{4}$')]
      }),
      name: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {
            id: productData._id,
            royalexId: productData.royalexId,
            name: productData.name,
            imagePath: productData.imagePath
          };
          this.form.setValue({
            royalexId: this.product.royalexId,
            name: this.product.name,
            image: this.product.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.royalexId,
        this.form.value.name,
        this.form.value.image
      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.royalexId,
        this.form.value.name,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

