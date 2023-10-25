import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  passwordForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeForm(): void {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const formData = this.passwordForm.value;
    
      if (formData.oldPassword !== formData.confirmPassword) {
        this.alert.warning('Passwords do not match!');
        return;
      }
    
      this.authService.getEmail().pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(email => {
        if (email) {
          this.authService.setPassword(formData.newPassword, formData.oldPassword, email as string).pipe(
            takeUntil(this.unsubscribe$)
          ).subscribe(
            () => {
              this.router.navigateByUrl('/user-profile').then(() => {
                this.alert.success('Password changed successfully!');
              });
            },
            error => {
              if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
                this.alert.warning('Incorrect password.');
              } else if (error.code === 'auth/too-many-requests') {
                this.alert.warning('Too many failed attempts. Account has been locked temporarily.');
              }
            }
          );
        }
      });
    } else {
      const newPasswordControl = this.passwordForm.get('newPassword');
      const oldPasswordControl = this.passwordForm.get('oldPassword');
      const confirmPasswordControl = this.passwordForm.get('confirmPassword');
  
      if (newPasswordControl && newPasswordControl.errors) {
        if ('required' in newPasswordControl.errors) {
          this.alert.warning('New password is required.');
        }
      } else if (oldPasswordControl && oldPasswordControl.errors) {
        if ('required' in oldPasswordControl.errors) {
          this.alert.warning('Password is required.');
        }
      } else if (confirmPasswordControl && confirmPasswordControl.errors) {
        if ('required' in confirmPasswordControl.errors) {
          this.alert.warning("Passwords do not match.");
        }
      }
    }
  }  
}  
