import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {
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
      email: [{ value: '' }, [Validators.required, Validators.email]],
      password: [{ value: '' }, [Validators.required]],
      confirmPassword: [{ value: '' }, [Validators.required]],
      firstName: [{ value: '' }, [Validators.required, Validators.maxLength(25)]],
      lastName: [{ value: '' }, [Validators.required, Validators.maxLength(25)]]
    });
  }
  

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName
      };
  
      // Get email from authService
      let retrievedEmail: String | null = '';
  
      this.authService.getEmail().pipe(
        switchMap(email => {
          retrievedEmail = email;
          if (email) {
            return this.authService.signIn(email as string, formData.password);
          }
          console.error('No email retrieved for signIn');
          return of(null);
        })
      ).subscribe(
        () => {
          // Successful login indicates the password is correct
          this.updateUserInformation(userUpdateData, retrievedEmail as string);
        },
        error => {
          console.error('Error verifying user password:', error);
          // Show an error message to the user (e.g., using an alert or a toast notification)
        }
      );
    } else {
      console.log("invalid request");
    }
  }
  
  private updateUserInformation(userUpdateData: any, retrievedEmail: string | null) {
    const formData = this.profileForm.value;

    // Attempt to re-authenticate the user
    this.authService.reauthenticateUser(retrievedEmail as string, formData.password).subscribe(
        () => {
            // User re-authenticated successfully, now update the email
            this.authService.setEmail(formData.email).toPromise()
                .then((response: any) => {
                    console.log('Email updated successfully in Firebase', response);
                    return this.authService.getUserId().pipe(
                        switchMap((userId) => {
                            if (userId) {
                                return this.userService.updateUser(userId, userUpdateData);
                            }
                            return of(null);
                        })
                    ).toPromise();
                })
                .then((response: any) => {
                    console.log('PUT Request to PostgreSQL was successful', response);
                })
                .catch((error: Error) => {
                    console.error('Error:', error);
                });
        },
        (error: Error) => {
            console.error('Error during re-authentication:', error);
            // Handle re-authentication error, possibly notify user
        }
    );
  }
}  