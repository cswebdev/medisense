import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("can activate");
    return this.authService.isLoggedIn().pipe(
      take(1),
      map((isLoggedIn) => {
        const requiresAuth = route.data['requiresAuth'];
        if (requiresAuth === undefined) {
          throw new Error('Route data "requiresAuth" is not defined');
        }
  
        if (requiresAuth && !isLoggedIn) {
          console.log('Access denied: requires authentication');
          return this.router.createUrlTree(['/patient-portal']);
        }
  
        if (!requiresAuth && isLoggedIn) {
          console.log('Access denied: requires no authentication');
          return this.router.createUrlTree(['/home']);
        }
  
        console.log('Access granted');
        return true;
      }),
      tap((result) => {
        if (result === true) {
          console.log('Access granted');
        } else {
          console.log('Access denied');
        }
      })
    );
  }
}
