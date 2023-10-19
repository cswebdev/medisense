import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


  @Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
  })



  export class RegistrationComponent {

    userRegistrationForm: FormGroup;

    passwordsMatchError: boolean = false;

    isLoading: boolean = false;


    constructor(
      private fb: FormBuilder,
      private registrationService: RegistrationService,
      private router: Router,
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
      
            if (response) {
              this.router.navigate(['patient-portal']).catch(error => console.error('Navigation Error:', error));
            } else {
              console.warn('Registration was successful, but the response was not as expected. Not navigating.');
            }
          },
          error => {
            console.error('Error:', error);
            // Optionally, show some user-friendly error message or notification here
          }
        );
        
      }
    }
  }
