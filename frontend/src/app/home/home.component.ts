import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userLoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService) {
      this.userLoginForm = this.fb.group({
        username:['',Validators.required],
        password:['', Validators.required]
      })
   
  }

  onLogin() {
    const { username, password } = this.userLoginForm.value;

    this.authService.login(username, password).subscribe(
      response => {
        if (response.status === 200) {
          console.log('Successfully logged in!', response.body);
          // You can now navigate to another route, set user details in a store, etc.
        }
      },
      error => {
        console.error('Login failed!', error);
      }
    );
  }
}
