import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authService: AuthService
  ) {}

  loginUser(email: string, password: string ): Observable<string> {
    return this.authService.signIn(email, password).pipe(
      switchMap((user: firebase.User | null) => {
        if (!user) {
          console.error('No user!');
          return throwError(() => new Error('Login failed!'));
        }

        // Return the token after successful login
        return from(user.getIdToken());
      }),
      catchError(error => {
        console.error('Login Error:', error);
        return throwError(() => new Error('Login failed due to an unexpected error.'));
      })
    );
  }
}
