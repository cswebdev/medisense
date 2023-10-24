import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, switchMap, takeUntil, of, first } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
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
      firstName: ['', [Validators.required, Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.maxLength(25)]],
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
  
      if (formData.password !== formData.confirmPassword) {
        this.alert.warning('Passwords do not match!');
        return;
      }
  
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
            this.reauthenticateAndSave(email, formData.password, userUpdateData);
          } else {
            this.alert.warning('No email retrieved for re-authentication');
          }
        },
        error => {
          this.alert.warning('Error retrieving email');
        }
      );
    } else {
      this.alert.warning("Invalid request");
    }
  }
  

  private reauthenticateAndSave(email: string, password: string, userUpdateData: any) {
    this.authService.reauthenticateUser(email, password).pipe(
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
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
