import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, switchMap, takeUntil, of, first, last } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Subject } from 'rxjs';
import { CustomValidators } from '../validators/custom-validators';
import { MedicationService } from '../services/medication.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;

  private destroy$ = new Subject<void>();
  isLoading = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private medicationService: MedicationService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  
    this.userService.getFirstName().pipe(
      map(firstName => firstName ?? null),
      takeUntil(this.destroy$)
    ).subscribe(firstName => {
      this.profileForm.get('firstName')?.setValue(firstName);
    });
  
    this.userService.getLastName().pipe(
      map(lastName => lastName ?? null),
      takeUntil(this.destroy$)
    ).subscribe(lastName => {
      this.profileForm.get('lastName')?.setValue(lastName);
    });
  }
  
  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, 
                       Validators.maxLength(25),
                       CustomValidators.whitespaceValidator()]],
      lastName: ['', [Validators.required, 
                      Validators.maxLength(25),
                      CustomValidators.whitespaceValidator()]],
      deleteAccount: [false],
      confirmDelete: [''],
    }, { validator: [ CustomValidators.fieldsMatchValidator('password', 'confirmPassword'),
                      CustomValidators.deleteAccountValidator('deleteAccount', 'confirmDelete') ]});
  }

  onSubmit() {
    this.isLoading = true;
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
  
      this.authService.getEmail().pipe(
        first(),
        takeUntil(this.destroy$)
      ).subscribe(
        email => {
          if (email) {
            if (formData.deleteAccount) {
              this.reauthenticateAndDelete(email, formData.password);
            } else {
              this.reauthenticateAndSave(email, formData.password, userUpdateData);
            }
          } else {
            this.alert.warning('No email retrieved for re-authentication');
          }
        },
        error => {
          if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
            this.alert.warning('Incorrect password.');
          } else if (error.code === 'auth/too-many-requests') {
            this.alert.warning('Too many failed attempts. Account has been locked temporarily.');
          }
        }
      );
    } else {
      this.isLoading = false;
      const passwordControl = this.profileForm.get('password');
      const confirmPasswordControl = this.profileForm.get('confirmPassword');
      const firstNameControl = this.profileForm.get('firstName');
      const lastNameControl = this.profileForm.get('lastName');
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
      } else if (passwordControl && passwordControl.errors) {
        if ('required' in passwordControl.errors) {
          this.alert.warning('Password is required!');
        }
      } else if (confirmPasswordControl && confirmPasswordControl.errors) {
        if ('required' in confirmPasswordControl.errors) {
          this.alert.warning("Passwords do not match!");
        }
      } else if (this.profileForm.hasError('fieldsMismatch')) {
          this.alert.warning('Passwords do not match!');
      } else if (this.profileForm.hasError('deleteAccount')) {
        this.alert.warning('You must enter "DELETE" to confirm account deletion.')
      }
    }
  }

  

  private reauthenticateAndSave(email: string, password: string, userUpdateData: any) {
    this.authService.reauthenticateUser(email, password).pipe(
      first(),
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.saveUserInformation(userUpdateData);
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

  private saveUserInformation(userUpdateData: any) {
    this.authService.getUserId().pipe(
      first(),
      switchMap(userId => {
        if (userId) {
          return this.userService.updateUser(userId, userUpdateData);
        }
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      response => {
        this.router.navigate(['/user-profile']);
        this.alert.success('User information updated successfully!');
      },
      error => {
        console.error('Error updating user:', error);
        this.alert.danger("Error updating user.");
      }
    );
  }

  private reauthenticateAndDelete(email: string, password: string) {
    this.authService.reauthenticateUser(email, password).pipe(
      first(),
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.deleteUser();
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

  private deleteUser() {
    this.authService.getUserId().pipe(
      first(),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User ID not found');
        }
        // First, delete all medications for the user
        return this.medicationService.deleteAllMedicationsByUserId(userId).pipe(
          switchMap(() => {
            // Then delete the user
            return this.userService.deleteUser(userId);
          })
        );
      }),
      switchMap(() => {
        // Finally, delete the user's account
        return this.authService.deleteAccount();
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.router.navigate(['/login']);
        this.alert.success('User account deleted successfully!');
      },
      error => {
        this.alert.danger('Error during account deletion.');
      }
    );
  }
  
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
