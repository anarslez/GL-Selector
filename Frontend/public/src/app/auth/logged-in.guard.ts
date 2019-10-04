import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PreventLoggedInAccess implements CanActivate {
  constructor (
    private _authService: AuthService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const redirectUrl = route['_routerState']['url'];

    if (!this._authService.isLoggedIn) {
      return true;
    }
    // return this._router.navigateByUrl(
    //   this._router.createUrlTree(
    //     ['/dashboard'], {
    //       queryParams: {
    //         redirectUrl
    //       }
    //     }
    //   )
    // );
  }
}
