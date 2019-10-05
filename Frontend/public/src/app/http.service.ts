import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpService {

  constructor(private _http: HttpClient) {
  }

  sendImage(imgObject, userId?: number) {
    console.log(userId);
    return this._http.post('http://localhost:8000/capture/' + userId + '/', imgObject);
  }

  retrieveUserImages (userId: number) {
    console.log('hit retrieve route');
    return this._http.get('http://localhost:8000/retrieve/' + userId + '/');
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

