import { Injectable } from '@angular/core';

export interface ServerValidationResponse {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  confirm?: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

}
