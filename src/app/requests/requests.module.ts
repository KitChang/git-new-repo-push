import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RequestCreateComponent } from './request-create/request-create.component';
import { RequestListComponent } from './request-list/request-list.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [RequestCreateComponent, RequestListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class RequestsModule {}
