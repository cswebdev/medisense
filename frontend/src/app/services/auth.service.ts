import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, from, Observable, throwError, tap } from 'rxjs';
import { catchError, map, take, switchMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { EmailAuthProvider, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<firebase.default.User | null>(null);
  public user$ = this.afAuth.authState;

  constructor(private afAuth: AngularFireAuth, private router: Router) {

}

  getEmail(): Observable<String | null> {
    return this.user$.pipe(map((user) => (user ? user.email : null)));
  }

  getUserId(): Observable<String | null> {
    return this.user$.pipe(
      map((user) => (user && user.uid !== undefined ? user.uid : null))
    );
  }

  setEmail(newEmail: string): Observable<void> {
    return from(
      this.afAuth.currentUser.then((user) => {
        if (user) {
          return user.updateEmail(newEmail);
        } else {
          throw new Error('User not logged in');
        }
      })
    ).pipe(
      catchError((error) => {
        console.error('Error updating email:', error);
        throw error;
      })
    );
  }

  setPassword(newPassword: string): Observable<void> {
    return from(
      this.afAuth.currentUser.then((user) => {
        if (user) {
          return user.updatePassword(newPassword);
        } else {
          throw new Error('User not logged in');
        }
      })
    ).pipe(
      catchError((error) => {
        console.error('Error updating password:', error);
        throw error;
      })
    );
  }

  setPersistence(persistenceType: 'local' | 'session'): Observable<void> {
    return from(
      this.afAuth.setPersistence(persistenceType)
    ).pipe(
      catchError((error) => {
        console.error('Error setting persistence:', error);
        throw error;
      })
    );
  }

  signUp(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      catchError((error) => {
        console.error('Error during sign up:', error);
        throw error;
      })
    );
  }

  signIn(email: string, password: string): Observable<firebase.default.User | null> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        // Update the user subject with the authenticated user
        this.userSubject.next(userCredential.user);
        // Return the user observable
        return this.user$;
      }),
      catchError((error) => {
        // Log the error for debugging
        console.error('Login Error:', error);
        // Provide a more informative error message based on Firebase error codes
        let errorMessage = 'Login failed due to an unexpected error.';
        if (error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'No user found with the provided email.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password.';
              break;
            // Add more cases as needed for different Firebase error codes
          }
        }
        // Return an observable that emits the error message
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      catchError((error) => {
        console.error('Error during sign out:', error);
        throw error;
      })
    );
  }

  isAuthenticated(): Observable<firebase.default.User | null> {
    return this.user$;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated().pipe(map((user) => !!user));
  }

  isEmailVerified(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => user?.emailVerified ?? false),
      catchError((error) => {
        console.error('Error checking email verification:', error);
        throw error;
      })
    );
  }

  sendEmailVerification(): Observable<void> {
    return from(
      this.afAuth.currentUser.then((user) => {
        if (user) {
          return user.sendEmailVerification();
        } else {
          throw new Error('User not logged in');
        }
      })
    ).pipe(
      catchError((error) => {
        console.error('Error sending email verification:', error);
        throw error;
      })
    );
  }

  reauthenticateUser(email: string, password: string): Observable<Promise<firebase.default.User | null>> {
    return from(this.afAuth.currentUser).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }
        const credential = EmailAuthProvider.credential(email, password);

        return from(user.reauthenticateWithCredential(credential));
      }),
      map(() => this.afAuth.currentUser) // Map to return the current user after reauthentication
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.data['requiresAuth']) {
      return this.afAuth.authState.pipe(
        take(1),
        map((user) => (user ? true : this.router.createUrlTree(['/']))),
        tap((loggedIn) => {
          if (loggedIn === true) {
            console.log('Access granted');
          } else {
            console.log('Access denied');
          }
        })
      );
    }
    return true;
  }
}