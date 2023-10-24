import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnDestroy {
  userRegistrationForm: FormGroup;
  passwordsMatchError: boolean = false;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.userRegistrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.userRegistrationForm.valid) {
      const formValue = this.userRegistrationForm.value;
      if (formValue.password !== formValue.confirmPassword) {
        this.passwordsMatchError = true;
        console.log('Passwords do not match');
        this.isLoading = false;  // Set isLoading to false when passwords do not match
        return;
      }
      this.passwordsMatchError = false;
  
      this.registrationService.registerUser(formValue)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          response => {
            console.log('User registered successfully', response);
            this.alertService.success('Successfully registered! A verification email has been sent. Check your email!');
            this.router.navigate(['/patient-portal']).catch(error => console.error('Navigation Error:', error));
          },
          error => {
            console.error('Error:', error);
            this.alertService.warning('Failed to register! Please try again later.');
          },
          () => {
            this.isLoading = false;  // Set isLoading to false when the observable completes
          }
        );
    } else {
      this.isLoading = false;  // Set isLoading to false when form is invalid
    }
  }
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
