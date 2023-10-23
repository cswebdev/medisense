import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {
  emailForm!: FormGroup;

  userEmail$!: Observable<String | null>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.authService.getEmail().pipe(
      map(email => email ?? null),
    ).subscribe(email => {
      this.emailForm.get('email')?.setValue(email);
    });
  }

  private initializeForm(): void {
    this.emailForm = this.formBuilder.group({
      email: [this.userEmail$, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      const formData = this.emailForm.value;

      if (formData.password !== formData.confirmPassword) {
        console.error('Passwords do not match!');
        // Optionally, show some user-friendly error message or notification here
        return;
      }

      this.authService.getEmail().subscribe(currentEmail => {
        if (currentEmail) {
          this.authService.setEmail(formData.email, formData.password, currentEmail as string).subscribe(
            () => {
              console.log('Email updated successfully');
              this.router.navigate(['/user-profile']);
            },
            error => {
              console.error('Error updating email:', error);
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
