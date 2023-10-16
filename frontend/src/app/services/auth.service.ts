import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Property to store user's authentication state
  public user$: Observable<firebase.default.User | null>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // Set the user$ observable to track the user's authentication state
    this.user$ = this.afAuth.authState;
  }

  // Sign up with email and password
  async signUp(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign out
  async signOut(): Promise<void> {
    return await this.afAuth.signOut();
  }

  // Check if the user is authenticated
  isAuthenticated(): Observable<firebase.default.User | null> {
    return this.user$;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // If the route has data 'requiresAuth' set to true, check authentication
    if (route.data['requiresAuth']) {
      return this.afAuth.authState.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if (!loggedIn) {
            console.log('Access denied');
            this.router.navigate(['/']);
          }
        })
      );
    }
    return true; // Allow access by default
  }
}
