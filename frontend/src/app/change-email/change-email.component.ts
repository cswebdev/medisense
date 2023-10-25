import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, takeUntil } from 'rxjs'; // Import takeUntil
import { AlertService } from '../services/alert.service';
import { Subject } from 'rxjs'; // Import Subject
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit, OnDestroy {
  emailForm!: FormGroup;
  userEmail$!: Observable<string | null>;

  isLoading = false;

  private destroy$ = new Subject<void>(); // Create a Subject to manage the subscription lifecycle

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.authService.getEmail().pipe(
      map(email => email ?? null),
      takeUntil(this.destroy$) // Ensure the subscription is unsubscribed when the component is destroyed
    ).subscribe(email => {
      this.emailForm.get('email')?.setValue(email);
    });
  }

  private initializeForm(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [ Validators.required,
                    Validators.email,
                    CustomValidators.whitespaceValidator()]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: CustomValidators.fieldsMatchValidator('password', 'confirmPassword') });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.emailForm.valid) {
      const formData = this.emailForm.value;

      if (formData.password !== formData.confirmPassword) {
        this.alert.warning('Passwords do not match!');
        return;
      }

      this.authService.getEmail().pipe(
        takeUntil(this.destroy$) // Ensure the subscription is unsubscribed when the component is destroyed
      ).subscribe(currentEmail => {
        if (currentEmail) {
          this.authService.setEmail(formData.email, formData.password, currentEmail as string).pipe(
            takeUntil(this.destroy$) // Ensure the subscription is unsubscribed when the component is destroyed
          ).subscribe(
            () => {
              this.router.navigate(['/user-profile']);
              this.alert.success('Email change request successful. Check your current email to confirm the change.');
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
      });
    } else {
      this.isLoading = false;
      const emailControl = this.emailForm.get('email');
      const passwordControl = this.emailForm.get('password');
      const confirmPasswordControl = this.emailForm.get('confirmPassword');
  
      if (emailControl && emailControl.errors) {
        if ('required' in emailControl.errors) {
          this.alert.warning('Email is required.');
        }
        else if ('email' in emailControl.errors) {
          this.alert.warning('Email is invalid.');
        } else if ('whitespace' in emailControl.errors) {
          this.alert.warning('Email cannot contain whitespace.')
        }
      } else if (passwordControl && passwordControl.errors) {
        if ('required' in passwordControl.errors) {
          this.alert.warning('Password is required.');
        }
      } else if (confirmPasswordControl && confirmPasswordControl.errors) {
        if ('required' in confirmPasswordControl.errors) {
          this.alert.warning("Passwords do not match.");
        }
      } else if (this.emailForm.hasError('fieldsMismatch')) {
        this.alert.warning('Passwords do not match!');
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
