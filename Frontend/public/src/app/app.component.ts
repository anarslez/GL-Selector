import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {
  title = 'public';

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._authService.autoLogin();
    if (this._authService.isLoggedIn) {
      this._router.navigate(['/dashboard']);
    }
  }
}
