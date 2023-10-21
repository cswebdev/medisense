import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, switchMap, tap, of } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userLoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.userLoginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      persistence: [false]
    });
  }
  
  handleLogin(): void {
    const formValue = this.userLoginForm.value;
    const persistenceType = formValue.persistence ? 'local' : 'session';

    this.authService.setPersistence(persistenceType).pipe(
      switchMap(() => {
        return this.loginService.loginUser(formValue.email, formValue.password);
      }),
      tap(() => {
        this.alertService.success('Successfully logged in!');
        this.router.navigate(['/patient-portal']);
      }),
      catchError((error: Error) => {
        this.alertService.warning('Incorrect username or password!');
        return of(null);
      }),
    ).subscribe();
  }
}
