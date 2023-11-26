import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { switchMap, map } from 'rxjs/operators';
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private userService: UserService, private authService: AuthService) { }

  registerUser(userData: any): Observable<any> {
    return from(this.authService.signUp(userData.email, userData.password)).pipe(
      switchMap((credential: firebase.auth.UserCredential) => {
        if (!credential.user) {
          console.error("No user in credential!");
          return throwError("No user in credential!");
        }
        
        return from(credential.user.getIdToken()).pipe(
          switchMap(idToken => {
            const userDTO = {
              idToken: idToken,
              firstName: userData.firstName,
              lastName: userData.lastName
            };
            this.authService.sendEmailVerification();
            return this.userService.createUser(userDTO);
          })
        );
      })
    );
  }
  
}
