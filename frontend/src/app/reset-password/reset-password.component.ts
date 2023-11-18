import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  resetForm!: FormGroup;

  isLoading = false;

  isResetButtonDisabled = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const lastSentTimestamp = localStorage.getItem('lastResetEmailSentTimestamp');
    if (lastSentTimestamp) {
      const timePassed = Date.now() - parseInt(lastSentTimestamp);
      if (timePassed < 180000) {
        this.isResetButtonDisabled = true;
        timer(180000 - timePassed).subscribe(() => {
          this.isResetButtonDisabled = false;
          localStorage.removeItem('lastResetEmailSentTimestamp');
        });
      }
    }

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeForm(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [ Validators.required, 
                    Validators.email ]]
    }, {});
  }

  onSubmit() {
    this.isLoading = true;
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      if (this.isResetButtonDisabled) {
        const lastSentTimestamp = parseInt(localStorage.getItem('lastResetEmailSentTimestamp') || '0', 10);
        const timePassed = Date.now() - lastSentTimestamp;
        const timeRemaining = Math.ceil((180000 - timePassed) / 1000); // in seconds
        if (timeRemaining > 0) {
          this.alert.warning(`Please wait ${timeRemaining} more seconds before sending another password reset email.`);
          this.isLoading = false;
          return;
        }
        else {
          localStorage.removeItem('lastResetEmailSentTimestamp');
          this.isResetButtonDisabled = false;
        }
      }
      this.authService.resetPassword(email).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(
        () => {
          this.isLoading = false;
          this.alert.success('Password reset email sent successfully. Please check your email to reset your password.');
          localStorage.setItem('lastResetEmailSentTimestamp', Date.now().toString());
          this.isResetButtonDisabled = true;
          this.router.navigate(['/login']);
        },
        error => {
          this.isLoading = false;
          if (error.code === 'auth/too-many-requests') {
            this.alert.danger('Too many requests. Please try again later.');
          }
          else {
            this.alert.danger('An error occurred while attempting to send the password reset email.');
          }
        }
      );
    } else {
      this.isLoading = false;
      const emailControl = this.resetForm.get('email');
  
      if (emailControl && emailControl.errors) {
        if ('required' in emailControl.errors) {
          this.alert.warning('Email cannot be blank.');
        } else if ('email' in emailControl.errors) {
          this.alert.warning('Email is not valid!');
        }
      }
    }
  }  
}  
