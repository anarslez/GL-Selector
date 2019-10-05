import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  loginPost(token) {
    return this._http.post('/session', {token: token});
  }

  sendImage(imgObject) {
    return this._http.post('http://localhost:8000/capture/', imgObject);
  }

  test() {
    return this._http.get('http://localhost:8000/test/');
  }

  psuedoCamFunc (image: string, userId?: string) {
    // one required argument (img object), one notRequired argument (user.id if logged in)
    // if a user is logged in, send image AND user.id
      // in python views, check if the request has an id parameter
      // if it does, process image and create face object for the user
    // if user is NOT logged in, just send image object
      // process image and return response
  }

  retrieveUserImages () {
    // queries database for images based on the user that is logged in
    // subscribe to this.user (w/i dashboard.component.ts)
      // run .pipe(take(1), exhaustMap(...)...) and convert to subscription to this method
      // data returned from this method should be in the form of image objects
    // only used when the 'gallery modal' is opened
    // will likely use the 'retrieve' method within views.py
  }

  // @ts-ignore
  // tslint:disable-next-line:member-ordering

}

