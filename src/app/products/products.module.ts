import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [ProductCreateComponent, ProductListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ProductRoutingModule
  ]
})
export class ProductsModule {}
