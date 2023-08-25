import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent {

  first_name: string = '';
  last_name: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';

    @NgModule({
      imports: [
        FormsModule
      ]
    })

  
  onSubmit(event: Event) {
    event.preventDefault();
    console.log('onSubmit()');
    console.log('first_name: ' + this.first_name);
    console.log('last_name: ' + this.last_name);
    console.log('email: ' + this.email);
    console.log('password: ' + this.password);
  }
 

}
