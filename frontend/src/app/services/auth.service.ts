import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmailAuthProvider } from '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$ = this.afAuth.authState;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  getEmail(): Observable<String | null> {
    return this.user$.pipe(map((user) => user?.email ?? null));
  }

  getUserId(): Observable<String | null> {
    return this.user$.pipe(map((user) => user?.uid ?? null));
  }

  setEmail(newEmail: string, password: string, oldEmail: string): Observable<void> {
    return from(this.signIn(oldEmail, password)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }
        if (!user.emailVerified) {
          throw new Error('Please verify your old email before updating to a new one');
        }
        return from(user.verifyBeforeUpdateEmail(newEmail)).pipe(
          switchMap(() => {
            return from(user.sendEmailVerification()); // Send verification email to new email
          })
        );
      }),
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
    console.log("auth persistence");
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
      map((userCredential) => userCredential.user),
      catchError((error) => {
        console.error('Login Error:', error);
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
}