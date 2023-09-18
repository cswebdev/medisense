  import { Component, NgModule } from '@angular/core';
  import { FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

  @Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
  })



  export class RegistrationComponent {

    userRegistrationForm: FormGroup;

    passwordsMatchError: boolean = false;


    constructor(private fb: FormBuilder) {
      this.userRegistrationForm = this.fb.group({
        first_name:['', Validators.required],
        last_name:['', Validators.required],
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
          console.log("passwords do not match")
          return; // Do not proceed with form submission
        }
    
        // Reset the error message if passwords match
        this.passwordsMatchError = false;
    
        console.log('onSubmit()');
        console.log('first_name: ' + formValue.first_name);
        console.log('last_name: ' + formValue.last_name);
        console.log('email: ' + formValue.email);
        console.log('password: ' + formValue.password);
      }
    }
}
