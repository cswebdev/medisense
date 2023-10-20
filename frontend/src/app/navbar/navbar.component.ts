import { Component, OnDestroy } from '@angular/core';
import { LogoutService } from '../services/logout.service';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {

  loggedIn: boolean = false;
  userEmail: String | null = '';
  emailVerified: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, 
              private logoutService: LogoutService,
              private alertService: AlertService, 
              private router: Router
  ) {
    this.authService.isLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        this.loggedIn = isLoggedIn;
        if (isLoggedIn) {
          this.authService.getEmail().subscribe(email => {
            this.userEmail = email;
          });
        }
      });
    this.authService.isEmailVerified()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isVerified => {
        this.emailVerified = isVerified;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleLogout() {
    this.logoutService.logoutUser().subscribe(
      () => {
        console.log('Logged out successfully');
        this.alertService.success('Successfully logged out!');
        // this.router.navigate(['home']).catch(error => console.error('Navigation Error:', error));
        // Maybe navigate the user to the login page or show a message
      },
      error => {
        console.error('Error logging out:', error);
        // Handle or display the error to the user
      }
    );
  }
  
}

export class NgbdNavBasic {
  active = 1;
}
