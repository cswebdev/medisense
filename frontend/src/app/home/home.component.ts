import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Renderer2, ElementRef } from '@angular/core';
import { switchMap, tap, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userLoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService // Inject AuthService
  ) {
    this.userLoginForm = this.fb.group({
      email:['',Validators.required],
      password:['', Validators.required],
      persistence: [false]
    });
  }

  onClick() {
    const modal = this.el.nativeElement.querySelector('#errorModal');
    this.renderer.removeClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'none');
  }
  
  handleLogin() {
    const formValue = this.userLoginForm.value;
    const persistenceType = formValue.persistence
      ? 'local'
      : 'session';
  
    // Set the persistence
    this.authService.setPersistence(persistenceType).pipe(
      switchMap(() => {
        // Call signIn method directly
        return this.loginService.loginUser(formValue.email, formValue.password);
      }),
      tap((response: any) => {
        console.log('Successfully logged in!', response);
  
        // Navigate to the patient portal after successful login
        this.alertService.success('Successfully logged in!');
        // this.router.navigate(['/patient-portal']);
      }),
      catchError((error: Error) => {
        console.error('Error:', error);
        console.log('Error - wrong username or password');
  
        // Trigger the modal to show the error
        this.alertService.warning('Incorrect username or password!');
        // We need to return a non-error observable here to keep the stream alive
        return of(null);
      }),
    ).subscribe();
  }  
}
