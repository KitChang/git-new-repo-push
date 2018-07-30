import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { UserListComponent } from './users/user-list/user-list.component';
import { RequestListComponent } from './requests/request-list/request-list.component';
import { RequestCreateComponent } from './requests/request-create/request-create.component';

const routes: Routes = [
  { path: '', component: RequestListComponent },
  { path: 'create', component: RequestCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: RequestCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'users', component: UserListComponent },
  { path: 'products', loadChildren: './products/products.module#ProductsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
