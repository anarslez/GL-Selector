import {Component, OnDestroy, OnInit} from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  private userSub: Subscription;

  constructor(
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    this.userSub = this._authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    $('.ui.dropdown').dropdown({on: 'hover'});
  }

  onLogout() {
    this._authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
