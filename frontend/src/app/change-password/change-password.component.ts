import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

      this.authService.getEmail().subscribe(email => {
        if (email) {
          this.authService.setPassword(formData.newPassword, formData.oldPassword, email as string).subscribe(
            () => {
              console.log('Password updated successfully');
            },
            error => {
              console.error('Error updating password:', error);
              // Show an error message to the user
            }
          );
          window.location.reload();
          this.router.navigate(['user-profile']);
        }
      });
    } else {
      console.log("Invalid form");
    }
  }
}

