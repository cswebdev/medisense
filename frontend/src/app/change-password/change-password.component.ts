import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  passwordForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeForm(): void {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const formData = this.passwordForm.value;
    
      if (formData.oldPassword !== formData.confirmPassword) {
        console.error('Passwords do not match!');
        // Optionally, show some user-friendly error message or notification here
        return;
      }
    
      this.authService.getEmail().pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(email => {
        if (email) {
          this.authService.setPassword(formData.newPassword, formData.oldPassword, email as string).pipe(
            takeUntil(this.unsubscribe$)
          ).subscribe(
            () => {
              console.log('Password updated successfully');
              // Navigate to patient-portal
              this.router.navigateByUrl('/user-profile').then(() => {
                // Show a success alert message
                this.alertService.success('Password changed successfully!');
              });
            },
            error => {
              console.error('Error updating password:', error);
              // Show an error message to the user
            }
          );
        }
      });
    } else {
      console.log("Invalid form");
    }
  }  
}  
