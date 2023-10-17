import { Injectable } from '@angular/core';
import { Observable, from, EMPTY } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import firebase from "firebase/compat/app";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private userService: UserService, private authService: AuthService) { }

  loginUser(userData: any): Observable<string> {
    return from(this.authService.signIn(userData.email, userData.password)).pipe(
      switchMap((credential: firebase.auth.UserCredential) => {
        if (!credential.user) {
          console.error("No user in credential!");
          return throwError("Login failed!"); // throwError creates an observable that will error out
        }
        
        // Return the token after successful login
        return from(credential.user.getIdToken());
      }),
      catchError(error => {
        console.error("Login Error:", error);
        return throwError("Login failed due to an unexpected error.");
      })
    );
  }
}
