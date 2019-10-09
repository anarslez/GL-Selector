import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { e } from '@angular/core/src/render3';

import { HttpService } from '../http.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Observable, Subscription } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  inputs = { send: true, component: 'dashboard', id: null };

  userSub: Subscription;
  user: any;
  userId: number;
  images = [];
  joinedDate: Date;

  constructor (
    private _httpService: HttpService,
    private _authService: AuthService,
    private _router: Router,
  ) { }

  ngOnInit() {
    if (!this._authService.isLoggedIn) {
      this._router.navigate(['/login']);
    }
    this.userSub = this._authService.user.subscribe(
      userData => {
        this.joinedDate = new Date(userData['joinedDate']);
        this.user = userData;
      }
    );
    this.userId = this.user.id;
    const imgObservable = this._httpService.retrieveUserImages(this.userId);
    imgObservable.subscribe(
      imageData => {
        for (const img of imageData['faces']) {
          this.images.push('data:image/jpeg;base64,' + img['image']);
        }
      }
    );
    $('.camera').css('display', 'none');
    $('.newpic').on('click', function(ev) {
      ev.preventDefault();
        $('#main').fadeOut(400, function() {
          $('.camera').fadeIn(400, function() {
        });
      });
    });
    $('#back').on('click', function(ev) {
      ev.preventDefault();
      $('.camera').fadeOut(400, function() {
        $('#main').fadeIn(400, function() {});
      });
    });
    $('.gallery').modal('attach events', '.close', 'hide');
    $('.gallery').modal('attach events', '#toggle', 'show');
    AOS.init();
  }

  // quick compensation for camera component living inside of dashboard component
    // called when 'Return to Dashboard' button is clicked
  reloadImages() {
    const imgObservable = this._httpService.retrieveUserImages(this.userId);
    imgObservable.subscribe(
      imageData => {
        this.images = [];
        for (const img of imageData['faces']) {
          this.images.push('data:image/jpeg;base64,' + img['image']);
        }
      }
    );
  }

  ngOnDestroy() {
    $('.gallery').remove();
    this.userSub.unsubscribe();
  }

}
