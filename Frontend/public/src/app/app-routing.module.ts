import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { PreventLoggedInAccess } from './auth/logged-in.guard';

import { LoginComponent } from './login/login.component';
import { HeadComponent } from './head/head.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GetstartedComponent } from './getstarted/getstarted.component';

const routes: Routes = [
  {
    path: '' ,
    component: HeadComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PreventLoggedInAccess]
  },
  {
    path: 'register',
    component: RegistrationComponent,
    // canActivate: [PreventLoggedInAccess]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'getstarted',
    component: GetstartedComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
