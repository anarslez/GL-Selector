import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from './user.model';

export interface ServerValidationResponse {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  confirm?: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private _router: Router,
    private _http: HttpClient,
    ) { }

  user = new BehaviorSubject<User>(null);

  loginUser(userObj) {
    return this._http
      .post('http://localhost:8000/login/', userObj)
      .pipe(
        tap(resData => {
          console.log(resData);
          this.handleAuthentication(resData['data']);
        })
      );
  }

  handleAuthentication (data: object) {
    const user = new User(
      data['id'],
      data['first_name'],
      data['last_name'],
      data['email'],
      data['joined_date'],
      data['access'],
      data['exp'],
    );
    this.user.next(user);
  }
}
