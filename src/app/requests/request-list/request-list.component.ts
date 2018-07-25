import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Request } from '../request.model';
import { RequestsService } from '../requests.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit, OnDestroy {
  // requests = [
  //   { title: "First Request", content: "This is the first request's content" },
  //   { title: "Second Request", content: "This is the second request's content" },
  //   { title: "Third Request", content: "This is the third request's content" }
  // ];
  requests: Request[] = [];
  isLoading = false;
  totalRequests = 0;
  requestsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private requestsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public requestsService: RequestsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.requestsService.getRequests(this.requestsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.requestsSub = this.requestsService
      .getRequestUpdateListener()
      .subscribe((requestData: { requests: Request[]; requestCount: number }) => {
        this.isLoading = false;
        this.totalRequests = requestData.requestCount;
        this.requests = requestData.requests;
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
    this.requestsPerPage = pageData.pageSize;
    this.requestsService.getRequests(this.requestsPerPage, this.currentPage);
  }

  onDelete(requestId: string) {
    this.isLoading = true;
    this.requestsService.deleteRequest(requestId).subscribe(() => {
      this.requestsService.getRequests(this.requestsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.requestsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

