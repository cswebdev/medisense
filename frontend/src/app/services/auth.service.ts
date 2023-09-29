import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'http://localhost:8080/api/v1';

  private loggedInUser: any = null;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const loginData = { username: username, password: password };
    return this.http.post(`${this.baseUrl}/login`, loginData, { observe: 'response' }).pipe(
      tap(response => {
        if (response.status === 200 && response.body) {
          this.loggedInUser = response.body;  // Store user details on successful login
        }
      })
    );
  }

  isLoggedIn(): boolean { 
    return this.loggedInUser !== null;
  }

  // Getter for loggedInUser
  getLoggedInUser(): any {
    return this.loggedInUser;
  }

  // Setter for LoggedInUser
  setLoggedInUser(user: any): void {
    this.loggedInUser = user;
  }

  // logout
  logout(): void {
    this.loggedInUser = null
  }

}
