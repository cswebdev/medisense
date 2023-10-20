import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<any> {

  constructor(private userService: UserService, private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
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