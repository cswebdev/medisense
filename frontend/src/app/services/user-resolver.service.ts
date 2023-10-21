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
export class UserResolverService implements Resolve<User | null> {

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (!userId) {
          return of(null);
        }
        return this.userService.getUser(userId).pipe(
          switchMap(user => {
            return this.authService.getEmail().pipe(
              switchMap(email => {
                return of({ ...user, email });
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error("Error fetching user data", error);
        return of(null);
      })
    );
  }
}
