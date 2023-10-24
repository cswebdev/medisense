import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, throwError, take, tap } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmailAuthProvider } from '@firebase/auth';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$ = this.afAuth.authState;

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private alert: AlertService
    ) {}

  getEmail(): Observable<string | null> {
    return this.user$.pipe(map((user) => user?.email ?? null));
  }

  getUserId(): Observable<string | null> {
    return this.user$.pipe(map((user) => user?.uid ?? null));
  }

  setEmail(newEmail: string, password: string, oldEmail: string): Observable<void> {
    return this.reauthenticateUser(oldEmail, password).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }
        if (!user.emailVerified) {
          throw new Error('Please verify your old email before updating to a new one');
        }
        return from(user.verifyBeforeUpdateEmail(newEmail)).pipe(
          switchMap(() => from(user.sendEmailVerification())) // Send verification email to new email
        );
      }),
      catchError((error) => {
        console.error('Error updating email:', error);
        throw error;
      })
    );
  }
  
  

  setPassword(newPassword: string, oldPassword: string, email: string): Observable<void> {
    console.log("Current user before password update:");
    console.log(this.user$);
  
    return this.reauthenticateUser(email, oldPassword).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }
        if (!user.emailVerified) {
          throw new Error('Please verify your email before updating your password');
        }
        return from(user.updatePassword(newPassword));
      }),
      switchMap(() => {
        // Retrieve the user again after the password has been updated
        return this.afAuth.authState.pipe(
          take(1),  // Take the first emitted value and then complete
          map((user) => {
            console.log("Current user after password update:");
            console.log(user);
          })
        );
      }),
      catchError((error) => {
        console.error('Error updating password:', error);
        return throwError(() => error);
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
        let errorMessage = 'Login failed due to an unexpected error.';
        if (error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'No user found with the provided email.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password.';
              break;
            case 'auth/invalid-login-credentials':
              errorMessage = 'Invalid login credentials.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by changing your password or you can try again later.';
              break;
          }
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  
  

  signOut(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      tap(() => {
        localStorage.clear(); // This will clear the local storage
      }),
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

  // In AuthService

  reauthenticateUser(email: string, password: string): Observable<firebase.default.User | null> {
    return from(this.afAuth.currentUser).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }
        const credential = EmailAuthProvider.credential(email, password);
        return from(user.reauthenticateWithCredential(credential));
      }),
      switchMap(() => from(this.afAuth.currentUser)) // Map to return the current user after reauthentication
    );
  }
}