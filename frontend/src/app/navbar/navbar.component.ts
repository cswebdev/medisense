import { Component, OnInit } from '@angular/core';  // Import OnInit
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
export class NavbarComponent implements OnInit {  // Implement OnInit
  loggedIn$: Observable<boolean>;
  userEmail$: Observable<string | null>;
  emailVerified$: Observable<boolean>;
  isVerificationButtonDisabled = false;

  constructor(
    private authService: AuthService,
    private logoutService: LogoutService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.loggedIn$ = this.authService.isLoggedIn();
    this.userEmail$ = this.authService.getEmail();
    this.emailVerified$ = this.authService.isEmailVerified();
  }

  ngOnInit() {  // Add ngOnInit lifecycle hook
    // Check local storage to see if enough time has passed since the last email was sent
    const lastSentTimestamp = localStorage.getItem('lastEmailSentTimestamp');
    if (lastSentTimestamp) {
      const timePassed = Date.now() - parseInt(lastSentTimestamp);
      if (timePassed < 180000) {
        this.isVerificationButtonDisabled = true;
        timer(180000 - timePassed).subscribe(() => {
          this.isVerificationButtonDisabled = false;
          localStorage.removeItem('lastEmailSentTimestamp');
        });
      }
    }
  }

  handleLogout() {
    this.logoutService.logoutUser().subscribe(
      () => {
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

    this.emailVerified$.pipe(
      take(1),
      filter(verified => !verified),
      switchMap(() => this.authService.sendEmailVerification())
    ).subscribe({
      next: () => {
        this.alertService.success('Verification email sent successfully!');
        localStorage.setItem('lastEmailSentTimestamp', Date.now().toString());
        timer(180000).subscribe(() => {
          this.isVerificationButtonDisabled = false;
          localStorage.removeItem('lastEmailSentTimestamp');
        });
      },
      error: (error) => {
        this.alertService.warning('Failed to send verification email. Please try again later.');
        this.isVerificationButtonDisabled = false;
      },
    });
  }
}
