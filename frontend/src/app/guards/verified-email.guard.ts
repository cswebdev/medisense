import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VerifiedEmailGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isEmailVerified().pipe(
      take(1),
      map((isEmailVerified) => {
        if (!isEmailVerified) {
          return this.router.createUrlTree(['/patient-portal']);
        }
        return true;
      }),
      tap((result) => {
        if (result === true) {
          console.log('Email verified');
        } else {
          console.log('Email not verified');
        }
      })
    );
  }
}
