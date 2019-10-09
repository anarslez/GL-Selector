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
  send: boolean;
  User: any;
  error = {};
  message: string;

  constructor(
    private _redirect: Router,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.message = '';
    this.send = true;
    this.User = {
      email: '',
      password: ''
    };
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
    const loginObs = this._authService.loginUser(this.User);
    loginObs.subscribe((dataRes: any) => {
      let response: any;
      response = dataRes;
      // console.log(response.data.joined_date);
      this._redirect.navigate(['/dashboard']);
    }, (errorRes: HttpResponse<ServerValidationResponse>) => {
      this.error = errorRes['error'];
      console.log(this.error);
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
