import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn().pipe(
      take(1),
      map((isLoggedIn) => {
        const isPublicRoute = ['/registration', '/login', '/reset-password'].includes(state.url);

        if (isPublicRoute && isLoggedIn) {
          return this.router.createUrlTree(['/patient-portal']);
        } else if (!isPublicRoute && !isLoggedIn) {
          return this.router.createUrlTree(['/login']);
        }

        return true;
      }),
      tap((result) => {
        if (result === true) {
          // console.log('Access granted');
        } else {
          // console.log('Access denied');
        }
      })
    );
  }
}