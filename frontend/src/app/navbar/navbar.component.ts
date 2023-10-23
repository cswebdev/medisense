import { Component } from '@angular/core';
import { LogoutService } from '../services/logout.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  loggedIn$: Observable<boolean>;
  userEmail$: Observable<string | null>;
  emailVerified$: Observable<boolean>;
  isVerificationButtonDisabled = false;

  constructor(private authService: AuthService, 
              private logoutService: LogoutService,
              private alertService: AlertService,
              private router: Router
  ) {
    this.loggedIn$ = this.authService.isLoggedIn();
    this.userEmail$ = this.authService.getEmail();
    this.emailVerified$ = this.authService.isEmailVerified();
  }

  handleLogout() {
    this.logoutService.logoutUser().subscribe(
      () => {
        console.log('Logged out successfully');
        this.alertService.success('Successfully logged out!');
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error logging out:', error);
      }
    );
  }

  sendEmailVerification() {
    this.isVerificationButtonDisabled = true;

    timer(180000) // 3 minutes
      .subscribe(() => {
        this.isVerificationButtonDisabled = false;
      });

    this.emailVerified$.pipe(
      take(1),
      filter(verified => !verified),
      switchMap(() => this.authService.sendEmailVerification())
    ).subscribe({
      next: () => {
        // Handle success, show a message to the user if necessary
        this.alertService.success('Verification email sent successfully!');
      },
      error: (error) => {
        // Handle error, show an error message to the user if necessary
        this.alertService.warning('Failed to send verification email. Please try again later.');
        // Removed console.error statement
      },
    });
  }  
}
