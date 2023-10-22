import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';


  @Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
  })



  export class RegistrationComponent {

    userRegistrationForm: FormGroup;

    passwordsMatchError: boolean = false;

    constructor(
      private fb: FormBuilder,
      private registrationService: RegistrationService,
      private router: Router,
      private alertService: AlertService
      ) {
      this.userRegistrationForm = this.fb.group({
        firstName:['', Validators.required],
        lastName:['', Validators.required],
        email:['', Validators.required], 
        password: ['', [Validators.required, Validators.minLength(6)]], 
        confirmPassword: ['', Validators.required],
      })
    }

    onSubmit() {
      if (this.userRegistrationForm.valid) {
        const formValue = this.userRegistrationForm.value;
        if (formValue.password !== formValue.confirmPassword) {
          this.passwordsMatchError = true;
          console.log("passwords do not match");
          return;
        }
        this.passwordsMatchError = false;
    
        this.registrationService.registerUser(formValue).subscribe(
          response => {
            console.log('User registered successfully', response);
            this.alertService.success('Successfully registered! A verification email has been sent. Check your email!');
            this.router.navigate(['patient-portal']).catch(error => console.error('Navigation Error:', error));
          },
          error => {
            console.error('Error:', error);
            this.alertService.warning('Failed to register! Please try again later.');
          }
        );
      }
    }    
  }
