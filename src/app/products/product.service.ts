import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap((data) => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    if (id === 0) {
      return of(this.initializeProduct());
    }
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap((data) => console.log('getProduct: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    product.id = null;
    return this.http.post<Product>(this.productsUrl, product, { headers }).pipe(
      tap((data) => console.log('createProduct: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  updateProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<Product>(url, product, { headers }).pipe(
      tap(() => console.log('Update product :' + product.id)),
      map(() => product),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete<Product>(url, { headers }).pipe(
      tap((data) => console.log('Delete Product' + id)),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An Error occurred:${err.error.message}`;
    } else {
      errorMessage = `SERVER returned an error code :${err.status}, error message is :${err.message} `;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private initializeProduct(): Product {
    // Return an initialized object
    return {
      id: 0,
    } as Product;
  }
}
