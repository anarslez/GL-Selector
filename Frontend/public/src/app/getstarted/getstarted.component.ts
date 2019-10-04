import {Component, OnDestroy, OnInit} from '@angular/core';

import { HttpService } from '../http.service';
import { AuthService } from '../auth/auth.service';
import {Subscription} from "rxjs";

declare var AOS: any;

@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.css']
})
export class GetstartedComponent implements OnInit{

  constructor(private _httpService: HttpService) { }


  ngOnInit() {
    AOS.init();
  }

  onTest() {
    this._httpService.test().subscribe(resData => {
      console.log(resData);
    }, error => {
      console.log(error);
    });
  }

}
