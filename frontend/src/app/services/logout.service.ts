import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private authService: AuthService) {}

  logoutUser(): Observable<void> {
    return from(this.authService.signOut()).pipe(
      catchError(error => {
        console.error("Logout Error:", error);
        return throwError(() => new Error("Logout failed due to an unexpected error."));
      })
    );
  }
}
