import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { map, take, tap, catchError } from 'rxjs/operators';

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

  getEmail(): Observable<String | null> {
    return this.user$.pipe(
      map(user => user ? user.email : null)
    );
  }

  getUserId(): Observable<String | null> {
    return this.user$.pipe(
      map(user => user && user.uid !== undefined ? user.uid : null)
    );
}


  // Sign up with email and password
  signUp(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      catchError(error => {
        console.error("Error during sign up:", error);
        throw error;
      })
    );
  }

  // Sign in with email and password
  signIn(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(
      this.afAuth.setPersistence('session').then(() => {
        return this.afAuth.signInWithEmailAndPassword(email, password);
      })
    ).pipe(
      catchError(error => {
        console.error("Error during sign in:", error);
        throw error;
      })
    );
  }



  // Sign out
  signOut(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      catchError(error => {
        console.error("Error during sign out:", error);
        throw error;
      })
    );
  }


  // Check if the user is authenticated
  isAuthenticated(): Observable<firebase.default.User | null> {
    return this.user$;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated().pipe(
      map(user => !!user)
    );
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
