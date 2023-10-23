import { Component } from '@angular/core';
import { LogoutService } from '../services/logout.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  loggedIn$: Observable<boolean>;
  userEmail$: Observable<string | null>;
  emailVerified$: Observable<boolean>;

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
}
