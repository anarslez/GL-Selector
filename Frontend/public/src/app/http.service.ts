import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private _http: HttpClient) {

  }

  retrieve(token) {
    return this._http.post('http://localhost:8000/retrieve', token);
  }

  logout() {
    console.log('Baby boy');
    return this._http.delete('/session');
  }

  check() {
    return this._http.get('/session');
  }

  createUser(userObj) {
    return this._http.post('http://localhost:8000/preregister', userObj);
  }
    
  loginUser(userObj) {
    console.log('in server loginUser', userObj);
    return this._http.post('http://localhost:8000/login', userObj);
  }

  loginPost(token) {
    return this._http.post('/session', {token: token});
  }

  sendImage(imgObject) {
    return this._http.post('http://localhost:8000/capture', imgObject);
  }
}

