import { Injectable } from '@angular/core';
import { Observable, from, EMPTY } from 'rxjs';
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
          // Handle the error or return an empty observable
          console.error("No user in credential!");
          return EMPTY;  // EMPTY is a type of observable that completes immediately without emitting any values.
        }
        
        return from(credential.user.getIdToken()).pipe(
          switchMap(idToken => {
            const userDTO = {
              idToken: idToken,
              user: userData
            };
            return this.userService.createUser(userDTO);
          })
        );
      })
    );
  }
}
