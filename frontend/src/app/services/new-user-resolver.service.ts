import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';  // Path to your UserService
import { AuthService } from './auth.service';  // Path to your UserService

@Injectable({
  providedIn: 'root'
})
export class NewUserResolverService implements Resolve<any> {

  constructor(private userService: UserService, private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (!userId) {
          // If userId is null, you can decide how to handle it. 
          // Here, I'm just returning an observable of null.
          return of(null);
        }
        return this.userService.getUser(userId);
      }),
      catchError((error) => {
        console.error("Error fetching new user data", error);
        return of(null);  // In case of error, return a null observable
      })
    );
  }
}
