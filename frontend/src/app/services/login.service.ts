import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AuthService) {}

  loginUser(email: string, password: string): Observable<string> {
    return this.authService.signIn(email, password).pipe(
      switchMap((user: firebase.User | null) => {
        if (!user) {
          return throwError(() => new Error('Login failed!'));
        }
  
        // Return the token after successful login
        return from(user.getIdToken());
      }),
      catchError(error => {
        // Removed the console.error line
        return throwError(() => new Error(error.message));
      })
    );
  }  
}
