import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Product } from './product.model';

const BACKEND_URL = environment.apiUrl + '/products/';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<{ products: Product[]; productCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any; maxProducts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                royalexId: product.royalexId,
                name: product.name,
                id: product._id,
                imagePath: product.imagePath
              };
            }),
            maxProducts: productData.maxProducts
          };
        })
      )
      .subscribe(transformedProductData => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts
        });
      });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string;
      royalexId: string;
      name: string;
      imagePath: string;
    }>(BACKEND_URL + id);
  }

  addProduct(royalexId: string, name: string, image: File) {
    const productData = new FormData();
    productData.append('royalexId', royalexId);
    productData.append('name', name);
    productData.append('image', image, royalexId);
    this.http
      .post<{ message: string; product: Product }>(
        BACKEND_URL,
        productData
      )
      .subscribe(responseData => {
        this.router.navigate(['/products']);
      });
  }

  updateProduct(id: string, royalexId: string, name: string, image: File | string) {
    let productData: Product | FormData;
    if (typeof image === 'object') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('royalexId', royalexId);
      productData.append('name', name);
      productData.append('image', image, royalexId);
    } else {
      productData = {
        id: id,
        royalexId: royalexId,
        name: name,
        imagePath: image
      };
    }
    this.http
      .put(BACKEND_URL + id, productData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteProduct(productId: string) {
    return this.http.delete(BACKEND_URL + productId);
  }
}
