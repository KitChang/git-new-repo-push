import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User } from './user.model';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; count: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; users: any; maxUsers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(data => {
          return {
            users: data.users.map(user => {
              return {
                email: user.email,
                id: user._id
              };
            }),
            maxUsers: data.maxUsers
          };
        })
      )
      .subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
          users: [...this.users],
          count: transformedUserData.maxUsers
        });
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      email: string;
    }>(BACKEND_URL + id);
  }

  updateUser(id: string, email: string) {
    let data: User;
    data = {
      id: id,
      email: email
    };

    this.http
      .put(BACKEND_URL + id, data)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteUser(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
