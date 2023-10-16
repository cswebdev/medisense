import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service'; 
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{
  user$: Observable<User>;
  error: any;

  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  profileForm!: FormGroup;

  public editToggled: boolean = false;
  public firstNameDisabled: boolean = true;
  public lastNameDisabled: boolean = true;
  public emailDisabled: boolean = true;
  public passwordDisabled: boolean = true;
  public saveDisabled: boolean = true;

  // constructor(private userService: UserService, private formBuilder: FormBuilder){
  //   this.firstNameDisabled = true;
  //   this.lastNameDisabled = true;
  //   this.emailDisabled = true;
  //   this.passwordDisabled = true;
  //   this.saveDisabled = true;

  //   this.user$ = this.userService.getUser(1);
  // }

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) {
    // const loggedInUser = this.authService.getLoggedInUser();
    // const userId = loggedInUser.id; // Assuming the user object has an 'id'

    this.user$ = this.userService.getUser(1);
  }

  ngOnInit() {
    this.user$.subscribe(
      (user) => {
        if (user) {
         this.firstName = user.first_name || '';
         this.lastName = user.last_name || '';
         this.email = user.email || '';
         this.password = user.password || '';

          this.profileForm = this.formBuilder.group({
              email: [user.email, [Validators.required, Validators.email]],
              first_name: [user.first_name, Validators.required],
              last_name: [user.last_name, Validators.required],
              password: [user.password, Validators.required]
          });
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  onSubmit() {
    // const loggedInUser = this.authService.getLoggedInUser();
    // const userId = loggedInUser.id;

    // if (this.profileForm.valid) {
    //   const formData = this.profileForm.value;
    //   this.userService.updateUser(userId, formData).subscribe(
    //     (response) => {
    //       console.log('PUT Request was successful', response);
    //       // Handle the successful response here (if needed)
    //     },
    //     (error) => {
    //       console.error('Error updating user:', error);
    //       // Handle the error here (display an error message, etc.)
    //     }
    //   );
    // }
    // else {
    //   //change this to display error message to user later
    //   console.log("invalid request");
    // }
    // this.editToggle();
  }
  

  editToggle(){
    this.firstNameDisabled = this.editToggled;
    this.lastNameDisabled = this.editToggled;
    this.emailDisabled = this.editToggled;
    this.passwordDisabled = this.editToggled;
    this.saveDisabled = this.editToggled;
    this.editToggled = !this.editToggled;
  }

}
