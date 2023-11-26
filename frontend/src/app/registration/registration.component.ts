import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Subject, takeUntil, finalize } from 'rxjs';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnDestroy {
  userRegistrationForm: FormGroup;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private alert: AlertService
  ) {
    this.userRegistrationForm = this.fb.group({
      firstName: ['', [Validators.required, 
                       Validators.maxLength(25), 
                       CustomValidators.whitespaceValidator()]],
      lastName: ['', [Validators.required,
                      Validators.maxLength(25),
                      CustomValidators.whitespaceValidator()]],
      email: ['', [Validators.required,
                   Validators.email,
                   CustomValidators.whitespaceValidator()]],
      password: ['', [Validators.required, 
                      Validators.minLength(6),
                      Validators.maxLength(25),
                      CustomValidators.whitespaceValidator(),
                      CustomValidators.capitalLetterValidator(),
                      CustomValidators.numberValidator(),
                      CustomValidators.specialCharacterValidator()]],
      confirmPassword: ['', [Validators.required, 
                             Validators.minLength(6),
                             Validators.maxLength(25),
                             CustomValidators.whitespaceValidator(),
                             CustomValidators.capitalLetterValidator(),
                             CustomValidators.numberValidator(),
                             CustomValidators.specialCharacterValidator()]],
    }, { validator: CustomValidators.fieldsMatchValidator('password', 'confirmPassword') });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.userRegistrationForm.valid) {
      const formValue = this.userRegistrationForm.value;
  
      this.registrationService.registerUser(formValue)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false)  // Set isLoading to false when the observable completes
        )
        .subscribe(
          response => {
            this.router.navigate(['/patient-portal']);
            this.alert.success('Successfully registered! A verification email has been sent. Check your email!');
          },
          error => {
            if (error.code === 'auth/email-already-in-use') {
              this.alert.warning('User with email already exists.');
            } else if (error.code === 'auth/invalid-email') {
              this.alert.warning('Invalid email format')
            } else {
              this.alert.warning('Something went wrong.');
            }
          }
        );
  } else {
    this.isLoading = false;
    const firstNameControl = this.userRegistrationForm.get('firstName');
    const lastNameControl = this.userRegistrationForm.get('lastName');
    const emailControl = this.userRegistrationForm.get('email');
    const passwordControl = this.userRegistrationForm.get('password');
    const confirmPasswordControl = this.userRegistrationForm.get('confirmPassword');
    if (firstNameControl && firstNameControl.errors) {
      if ('required' in firstNameControl.errors) {
        this.alert.warning('First name is required!');
      } else if ('whitespace' in firstNameControl.errors) {
        this.alert.warning('First name cannot contain whitespace.');
      } else if ('maxlength' in firstNameControl.errors) {
        this.alert.warning('First name cannot exceed 25 characters.');
      }
    } else if (lastNameControl && lastNameControl.errors) {
      if ('required' in lastNameControl.errors) {
        this.alert.warning('Last name is required!');
      } else if ('whitespace' in lastNameControl.errors) {
        this.alert.warning('Last name cannot contain whitespace.');
      } else if ('maxlength' in lastNameControl.errors) {
        this.alert.warning('Last name cannot exceed 25 characters.');
      }
    } else if (emailControl && emailControl.errors) {
      if ('required' in emailControl.errors) {
        this.alert.warning('Email address is required!');
      } else if ('whitespace' in emailControl.errors) {
        this.alert.warning('Email address cannot contain whitespace!');
      } else if ('email' in emailControl.errors) {
        this.alert.warning('Email address is invalid!');
      }
    } else if (passwordControl && passwordControl.errors) {
      if ('required' in passwordControl.errors) {
        this.alert.warning('Password is required!');
      } else if ('minlength' in passwordControl.errors) {
        this.alert.warning('Password must be at least 6 characters!')
      } else if ('maxlength' in passwordControl.errors) {
        this.alert.warning('Password must be less than 25 characters!')
      } else if ('whitespace' in passwordControl.errors) {
        this.alert.warning('Password cannot contain whitespace!');
      } else if ('noCapitalLetter' in passwordControl.errors) {
        this.alert.warning('Password must contain at least 1 capital letter.');
      } else if ('noNumber' in passwordControl.errors) {
        this.alert.warning('Password must contain at least 1 number.');
      } else if ('noSpecialCharacter' in passwordControl.errors) {
        this.alert.warning('Password must contain at least 1 special character.');
      }
    } else if (this.userRegistrationForm.hasError('fieldsMismatch')) {
        this.alert.warning('Passwords do not match!');
    }
  }
}
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
