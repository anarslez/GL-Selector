import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {HttpResponse} from '@angular/common/http';

import { ServerValidationResponse } from '../http.service';

declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  TheEmail: string;
  fullname: boolean;
  email: boolean;
  password: boolean;
  confirm: boolean;
  User: object = {first_name: '', last_name: '', email: '', password: '', confirm: '' };
  inputs = { send: true, component: 'register', User: null };
  error = {};

  constructor (
    private _httpService: HttpService,
    private _redirect: Router,
  ) { }

  ngOnInit() {
    // const observable = this._httpService.check();
    // observable.subscribe(data => {
    //   if (data['token'] > 0) {
    //     this._redirect.navigate(['/dashboard']);
    //   }
    // });
    this.fullname = false;
    this.email = false;
    this.password = false;
    this.confirm = false;
    const self = this;
    let section = false;
    function action() {
      self.TheEmail = '';
      self.fullname = false;
      self.email = false;
      self.password = false;
      self.confirm = false;
      const preregister = self._httpService.createUser(self.User);
      preregister.subscribe((info: any) => {
        console.log(info);
        if (info['success'] === true) {
          console.log('Rick and Morty');
          self.inputs.User = self.User;
          console.log(self.inputs);
          if (section) {
            $('#account').removeClass('transition visible');
            $('#account').addClass('transition hidden');
          }
          $('#account').css('display', 'none');
          $('#accountS').addClass('disabled');
          $('#socialP').removeClass('disabled');
          $('#social').transition('fly right');
          // $('#social button').removeClass('inverted violet');
          // $('#social button').addClass('inverted blue');
          section = true;
        } else {
          $('.next1').attr('disabled', false);
          for (const key in info) {
            if (key === 'first_name' || key === 'last_name') {
              self.fullname = true;
            } else if (key) {
              self[key] = true;
            }
          }
          if (self.email === true) {
            self.TheEmail = info['email'];
          }
        }
      });
    }
    // all this commented out stuff makes it so that client hits the server twice
    // $('#signup-form').on('submit', function(ev) {
    //   $('.next1').attr('disabled', true);
    //   ev.preventDefault();
    //   action();
    // });
    // $('.prev1').on('click', function(ev) {
    //   $('.next1').attr('disabled', false);
    //   self.User['precheck'] = true;
    //   ev.preventDefault();
    //   $('#accountS').removeClass('disabled');
    //   $('#socialP').addClass('disabled');
    //   $('#social').transition('hide');
    //   $('#account').transition('fly right');
    // });
  }

  createUser() {
    const preregister = this._httpService.createUser(this.User);
    preregister.subscribe((dataRes: any) => {
      let response: any;
      response = dataRes;
      console.log(response);
      this._redirect.navigate(['/dashboard']);
    }, (errorRes: HttpResponse<ServerValidationResponse>) => {
      this.error = errorRes['error'];
      console.log(this.error);
    });
  }
}
