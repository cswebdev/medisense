import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Renderer2, ElementRef } from '@angular/core';



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
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef ) {
      this.userLoginForm = this.fb.group({
        email:['',Validators.required],
        password:['', Validators.required]
      })
   
  }

  onClick() {
    
    const modal = this.el.nativeElement.querySelector('#errorModal');
    this.renderer.removeClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'none');
  }

  onSubmit() {
    this.loginService.loginUser(this.userLoginForm.value).subscribe(
      (response) => {
        console.log('Successfully logged in!', response);

        // Navigate to the patient portal after successful login
        this.router.navigate(['/patient-portal']); 
      },
      (error: Error) => {
        console.error('Error:', error);
        console.log('Error - wrong username or password');

        // Trigger the modal to show the error
        const modal = this.el.nativeElement.querySelector('#errorModal');
        this.renderer.addClass(modal, 'show');
        this.renderer.setStyle(modal, 'display', 'block');
      }
    );
  }
}
