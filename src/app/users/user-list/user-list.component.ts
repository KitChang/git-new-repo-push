import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private usersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public usersService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers(this.itemsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((userData: { users: User[]; count: number }) => {
        this.isLoading = false;
        this.totalItems = userData.count;
        this.users = userData.users;
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
    this.itemsPerPage = pageData.pageSize;
    this.usersService.getUsers(this.itemsPerPage, this.currentPage);
  }

  onDelete(userId: string) {
    this.isLoading = true;
    this.usersService.deleteUser(userId).subscribe(() => {
      this.usersService.getUsers(this.itemsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
