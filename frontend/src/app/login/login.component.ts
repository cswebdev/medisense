import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, switchMap, tap, of, Subject, takeUntil, first } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  userLoginForm: FormGroup;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private alert: AlertService,
    private router: Router,
    private authService: AuthService, 

  ) {
    this.userLoginForm = this.fb.group({
      email: ['', [ Validators.required, 
                    Validators.email ]],
      password: ['', Validators.required],
      persistence: [false]
    });
  }

  handleLogin(): void {
    if (this.userLoginForm.valid) {
      this.isLoading = true;
      const formValue = this.userLoginForm.value;
      const persistenceType = formValue.persistence ? 'local' : 'session';
  
      this.authService.setPersistence(persistenceType).pipe(
        switchMap(() => {
          return this.loginService.loginUser(formValue.email, formValue.password);
        }),
        first(), // Only take the first value emitted
        tap(() => {
          this.router.navigate(['/patient-portal']);
          this.alert.success('Successfully logged in!');
        }),
        catchError((error) => {
          this.alert.warning(error.message);
          return of(null);
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.isLoading = false;
      });
    } else {
      const emailControl = this.userLoginForm.get('email');
      const passwordControl = this.userLoginForm.get('password');
  
      if (emailControl && emailControl.errors) {
        if ('required' in emailControl.errors) {
          this.alert.warning('Email is required.');
        } else if ('email' in emailControl.errors) {
          this.alert.warning('Invalid email address.');
        } 
      } else if (passwordControl && passwordControl.errors) {
        if ('required' in passwordControl.errors) {
          this.alert.warning('Password is required.');
        }
      }
    }
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
