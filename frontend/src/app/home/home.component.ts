import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
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
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef ) {
      this.userLoginForm = this.fb.group({
        username:['',Validators.required],
        password:['', Validators.required]
      })
   
  }

  // onClick() {
    
  //   const modal = this.el.nativeElement.querySelector('#errorModal');
  //   this.renderer.removeClass(modal, 'show');
  //   this.renderer.setStyle(modal, 'display', 'none');
  // }

  onLogin() {
    const { username, password } = this.userLoginForm.value;

    this.authService.login(username, password).subscribe(
      response => {
        if (response.status === 200) {
          console.log('Successfully logged in!', response.body);
          this.authService.setLoggedInUser(response.body)
          console.log(response.body);
          this.router.navigate(['/patient-portal']); 

          // You can now navigate to another route, set user details in a store, etc.
        }
      },
      error => {
        console.log('Error - wrong username or password')
        // Trigger the modal
        // const modal = this.el.nativeElement.querySelector('#errorModal');
        // this.renderer.addClass(modal, 'show');
        // this.renderer.setStyle(modal, 'display', 'block');
      }
    );
  }
}
