import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service'; 
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;

  userEmail: String | null = '';
  userFirstName: String | undefined = '';
  userLastName: String | undefined = '';

  public editToggled: boolean = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  
    this.authService.getEmail().subscribe(email => {
      this.userEmail = email;
      this.updateFormValues();
    });
  
    this.userService.getFirstName().subscribe(firstName => {
      this.userFirstName = firstName;
      this.updateFormValues();
    });
  
    this.userService.getLastName().subscribe(lastName => {
      this.userLastName = lastName;
      this.updateFormValues();
    });
  }
  
  private updateFormValues(): void {
    if (this.userEmail && this.userFirstName && this.userLastName) {
      this.profileForm.patchValue({
        firstName: this.userFirstName,
        lastName: this.userLastName,
        email: this.userEmail
      });
    }
  }  

  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: [{ value: '••••••••', disabled: true }, Validators.required],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required]
    });
  }
  

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName
      };

      this.userService.updateUser(this.authService.getUserId(), userUpdateData).subscribe(
        response => console.log('PUT Request to PostgreSQL was successful', response),
        error => console.error('Error updating user in PostgreSQL:', error)
      );

      // Update email and password in Firebase here...

    } else {
      console.log("invalid request");
    }
    this.editToggle();
  }

  editToggle(): void {
    this.editToggled = !this.editToggled;
  }

  
}
