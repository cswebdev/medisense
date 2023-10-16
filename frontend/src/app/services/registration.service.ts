import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8080/api/v1/register'

  constructor(private userService: UserService, private authService: AuthService) { }

  registerUser(userData: any) {
    this.authService.signUp(userData.email, userData.password);
    return this.userService.createUser(userData);
  }
}
