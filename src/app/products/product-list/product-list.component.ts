import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent, Sort, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  // products = [
  //   { royalexId: "First Product", name: "This is the first product's name" },
  //   { royalexId: "Second Product", name: "This is the second product's name" },
  //   { royalexId: "Third Product", name: "This is the third product's name" }
  // ];
  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  displayedColumns: string[] = ['royalexId', 'name'];
  dataSource;
  private productsSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe((productData: { products: Product[]; productCount: number }) => {
        this.isLoading = false;
        this.totalProducts = productData.productCount;
        this.products = productData.products;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

