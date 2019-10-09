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
}

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _router: Router,
    ) { }

  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;
  isLoggedIn = false;

  registerUser(userObj) {
    return this._http
      .post('http://localhost:8000/register/', userObj)
      .pipe(
        tap(userData => {
          this.handleAuthentication(userData['data']);
        })
      );
  }

  loginUser(userObj) {
    return this._http
      .post('http://localhost:8000/login/', userObj)
      .pipe(
        tap(userData => {
          this.handleAuthentication(userData['data']);
        })
      );
  }

  autoLogin() {
    const userData: {
      id: number, firstName: string,
      lastName: string,
      email: string,
      joinedDate: string,
      _exp: number,
      _token: string,
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User (
      userData.id,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.joinedDate,
      userData._token,
      userData._exp,
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expiresIn = loadedUser.tokenExp - new Date().getTime();
      this.autoLogout(expiresIn);
      this.isLoggedIn = true;
      console.log(userData);
    }
  }

  autoLogout(expiresIn: number) {
    console.log(expiresIn);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.isLoggedIn = false;
    if (this._router.url === '/dashboard') {
      this._router.navigate(['/login']);
    }
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
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
    const expiresIn = user.tokenExp - new Date().getTime();
    this.autoLogout(expiresIn);
    localStorage.setItem('userData', JSON.stringify(user));
    this.isLoggedIn = true;
  }
}
