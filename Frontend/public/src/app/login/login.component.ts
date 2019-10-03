import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { HttpService } from '../http.service';
import { AuthService, ServerValidationResponse } from '../auth/auth.service';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor(
    private _httpService: HttpService,
    private _redirect: Router,
    private _authService: AuthService
  ) { }

  send: boolean;
  User: object = { email: '', password: '' };
  error = {};
  message: string;

  ngOnInit() {
    this.message = '';
    this.send = true;
    // const observable = this._httpService.check();
    // observable.subscribe(data => {
    //   if (data['token'] > 0) {
    //     this._redirect.navigate(['/dashboard']);
    //   } else {
    //     this.message = data['message'];
    //   }s
    // });
    AOS.init();
    $('.ui.form')
      .form({
        fields: {
          email: {
            identifier: 'email',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your email'
              }
            ]
          },
          password: {
            identifier: 'password',
            rules: [
              {
                type: 'empty',
                prompt: 'Please enter your password'
              }
            ]
          }
        }
    });
  }
  // loginUser() {
  //   const observable = this._httpService.loginUser(this.User);
  //   observable.subscribe((data: any) => {
  //     if (data['success'] === 'success') {
  //       const mario = this._httpService.loginPost(data['id']);
  //       mario.subscribe(() => {
  //         this._redirect.navigate(['/dashboard']);
  //       });
  //     } else {
  //       this.error = data['success'];
  //       if (this.message.length > 0) {
  //         this.message = '';
  //         console.log('Bangladesh');
  //         const giraffe = this._httpService.logout();
  //         giraffe.subscribe(() => {
  //           console.log('Lady Gaga');
  //         });
  //       }
  //     }
  //   });
  // }
  loginUser() {
    const observable = this._httpService.loginUser(this.User);
    observable.subscribe((dataRes: any) => {
      let response: any;
      response = dataRes;
      console.log(response);
      this._redirect.navigate(['/dashboard']);
    }, (errorRes: HttpResponse<ServerValidationResponse>) => {
      this.error = errorRes['error'];
    });
    // observable.subscribe((dataRes: any) => {
    //   let response: any;
    //   response = dataRes;
    //   console.log(response);
    //   this._redirect.navigate(['/dashboard']);
    // }, (errorRes: HttpResponse<serverValidationResponse>) => {
    //   this.isLoading = false;
    //   this.error = errorRes['error'];
    // });
  }

}
