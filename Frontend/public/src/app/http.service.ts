import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpService {

  constructor( private _http: HttpClient) {

  }

  retrieve(token) {
    return this._http.post('http://localhost:8000/retrieve/', token);
  }

  // createUser(userObj) {
  //   return this._http.post('http://localhost:8000/preregister', userObj);
  //     // .pipe(catchError(HttpService.handleError));
  // }

  createUser (userObj) {
    return this._http.post('http://localhost:8000/register/', userObj);
  }

  loginUser(userObj) {
    console.log('in server loginUser', userObj);
    return this._http.post('http://localhost:8000/login/', userObj);
  }

  loginPost(token) {
    return this._http.post('/session', {token: token});
  }

  sendImage(imgObject) {
    return this._http.post('http://localhost:8000/capture/', imgObject);
  }

  // @ts-ignore
  // tslint:disable-next-line:member-ordering

}

