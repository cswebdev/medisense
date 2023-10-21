import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {
  profileForm!: FormGroup;

  // userEmail$!: Observable<String | null>;
  userFirstName$!: Observable<String | null>;
  userLastName$!: Observable<String | null>;

  public editToggled: boolean = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  
    this.userService.getFirstName().pipe(
      map(firstName => firstName ?? null),
    ).subscribe(firstName => {
      this.profileForm.get('firstName')?.setValue(firstName);
    });
  
    this.userService.getLastName().pipe(
      map(lastName => lastName ?? null),
    ).subscribe(lastName => {
      this.profileForm.get('lastName')?.setValue(lastName);
    });
  }
  

  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      firstName: [this.userFirstName$, [Validators.required, Validators.maxLength(25)]],
      lastName: [this.userLastName$, [Validators.required, Validators.maxLength(25)]]
    });
  }
  

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;

      if (formData.password !== formData.confirmPassword) {
        console.error('Passwords do not match!');
        // Optionally, show some user-friendly error message or notification here
        return;
      }

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
      console.log("Invalid request");
    }
  }
  
  private updateUserInformation(userUpdateData: any, retrievedEmail: string | null) {
    const formData = this.profileForm.value;
  
    // Attempt to re-authenticate the user
    this.authService.reauthenticateUser(retrievedEmail as string, formData.password).subscribe(
      () => {
        console.log('Re-authentication successful');
        this.authService.getUserId().pipe(
          switchMap(userId => {
            if (userId) {
              return this.userService.updateUser(userId, userUpdateData);
            }
            return of(null);
          }),
        ).subscribe(
          response => {
            console.log('User information updated successfully', response);
            this.router.navigate(['user-profile']);
          },
          error => {
            console.error('Error updating user:', error);
          }
        );
      },
      (error: Error) => {
        console.error('Error during re-authentication:', error);
        // Handle re-authentication error, possibly notify user
      }
    );
  }  
}
