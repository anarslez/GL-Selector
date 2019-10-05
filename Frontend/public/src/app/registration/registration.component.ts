import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { AuthService, ServerValidationResponse} from '../auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  // email: boolean;
  // password: boolean;
  // confirm: boolean;
  User: object = {first_name: '', last_name: '', email: '', password: '', confirm: '' };
  inputs = { send: true, component: 'register', User: null };
  error = {};

  constructor (
    private _httpService: HttpService,
    private _redirect: Router,
    private _authService: AuthService
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    const register = this._authService.registerUser(this.User);
    register.subscribe((dataRes: any) => {
      let response: any;
      response = dataRes;
      console.log(response);
      this._redirect.navigate(['/dashboard']);
    }, (errorRes: HttpResponse <ServerValidationResponse>) => {
      this.error = errorRes['error'];
      console.log(this.error);
    });
  }
}
