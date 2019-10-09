import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { AuthService, ServerValidationResponse } from '../auth/auth.service';

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
  user: any;
  inputs = { send: true, component: 'register', User: null };
  error: any;

  constructor (
    private _redirect: Router,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.user = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm: ''
    };
    this.error = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm: ''
    };
  }

  onSubmit() {
    const register = this._authService.registerUser(this.user);
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
