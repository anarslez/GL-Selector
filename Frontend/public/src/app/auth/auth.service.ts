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
  tokenExpirationTimer: any;

  loginUser(userObj) {
    return this._http
      .post('http://localhost:8000/login/', userObj)
      .pipe(
        tap(resData => {
          this.handleAuthentication(resData['data']);
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this._router.url === '/dashboard') {
      this._router.navigate(['/login']);
    }
    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    // }
    // this.tokenExpirationTimer = null;
  }

  handleAuthentication (data: object) {
    const user = new User(
      data['id'],
      data['first_name'],
      data['last_name'],
      data['email'],
      data['joined_date'],
      data['access'],
      +data['exp'],
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
