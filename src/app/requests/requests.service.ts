import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Request } from './request.model';

const BACKEND_URL = environment.apiUrl + '/requests/';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private requests: Request[] = [];
  private requestsUpdated = new Subject<{ requests: Request[]; requestCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getRequests(requestsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${requestsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; requests: any; maxRequests: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(requestData => {
          return {
            requests: requestData.requests.map(request => {
              return {
                transactionId: request.transactionId,
                customer: request.customer,
                id: request._id,
                creator: request.creator,
                follower: request.follower
              };
            }),
            maxRequests: requestData.maxRequests
          };
        })
      )
      .subscribe(transformedRequestData => {
        this.requests = transformedRequestData.requests;
        this.requestsUpdated.next({
          requests: [...this.requests],
          requestCount: transformedRequestData.maxRequests
        });
      });
  }

  getRequestUpdateListener() {
    return this.requestsUpdated.asObservable();
  }

  getRequest(id: string) {
    console.log('getRequest');
    return this.http.get<{
      _id: string;
      transactionId: string;
      customer: string;
      creator: string;
      follower: string;
      products: [any];
      isRevoke: boolean;
    }>(BACKEND_URL + id);
  }

  addRequest(transactionId: string, customer: string, follower: string) {
    const requestData = {
      transactionId: transactionId,
      customer: customer,
      follower: follower
    };

    this.http
      .post<{ message: string; request: Request }>(
        BACKEND_URL,
        requestData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateRequest(id: string, transactionId: string, customer: string, follower: string,
    products: [any]) {
    let requestData: Request;
    requestData = {
      id: id,
      transactionId: transactionId,
      customer: customer,
      creator: null,
      follower: follower,
      products: products,
      isRevoke: null
    };

    this.http
      .put(BACKEND_URL + id, requestData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteRequest(requestId: string) {
    return this.http.delete(BACKEND_URL + requestId);
  }
}
