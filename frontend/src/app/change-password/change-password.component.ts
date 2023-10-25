import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  passwordForm!: FormGroup;

  isLoading = false;

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
      newPassword: ['', [ Validators.required, 
                          Validators.minLength(6),
                          Validators.maxLength(25),
                          CustomValidators.whitespaceValidator(),
                          CustomValidators.capitalLetterValidator(),
                          CustomValidators.numberValidator(),
                          CustomValidators.specialCharacterValidator()]],
      oldPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: CustomValidators.fieldsMatchValidator('password', 'confirmPassword') });
  }

  onSubmit() {
    this.isLoading = true;
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
      this.isLoading = false;
      const newPasswordControl = this.passwordForm.get('newPassword');
      const oldPasswordControl = this.passwordForm.get('oldPassword');
      const confirmPasswordControl = this.passwordForm.get('confirmPassword');
  
      if (newPasswordControl && newPasswordControl.errors) {
        if ('required' in newPasswordControl.errors) {
          this.alert.warning('New password is required.');
        } else if ('minlength' in newPasswordControl.errors) {
          this.alert.warning('Password must be at least 6 characters!')
        } else if ('maxlength' in newPasswordControl.errors) {
          this.alert.warning('Password must be less than 25 characters!')
        } else if ('whitespace' in newPasswordControl.errors) {
          this.alert.warning('Password cannot contain whitespace!');
        } else if ('noCapitalLetter' in newPasswordControl.errors) {
          this.alert.warning('Password must contain at least 1 capital letter.');
        } else if ('noNumber' in newPasswordControl.errors) {
          this.alert.warning('Password must contain at least 1 number.');
        } else if ('noSpecialCharacter' in newPasswordControl.errors) {
          this.alert.warning('Password must contain at least 1 special character.');
        }
      } else if (oldPasswordControl && oldPasswordControl.errors) {
        if ('required' in oldPasswordControl.errors) {
          this.alert.warning('Password is required.');
        }
      } else if (confirmPasswordControl && confirmPasswordControl.errors) {
        if ('required' in confirmPasswordControl.errors) {
          this.alert.warning("Passwords do not match.");
        }
      } else if (this.passwordForm.hasError('fieldsMismatch')) {
        this.alert.warning('Passwords do not match!');
      }
    }
  }  
}  
