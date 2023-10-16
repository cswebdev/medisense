import { Component, NgModule } from '@angular/core';
import { FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';


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
      private router: Router
      ) {
      this.userRegistrationForm = this.fb.group({
        first_name:['', Validators.required],
        last_name:['', Validators.required],
        username:['',Validators.required],
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
            this.router.navigate(['home']).catch(error => console.error('Navigation Error:', error));
          },
          error => console.error('Error:', error)
        );
      }
    }
  
  }
