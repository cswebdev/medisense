import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { User } from '../models/user.model';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; 

const baseUrl = 'http://localhost:8080/api/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFirstName(): Observable<String | undefined> {
    console.log(this.authService.getUserId());
    return this.authService.getUserId().pipe(
      switchMap((userId: String | null) => {
        if (userId) {
          // Since getUserId returns an Observable, we handle the ID inside this switchMap
          return this.getUser(userId);
        } else {
          return of(null);
        }
      }),
      map((user: User | null) => user ? user.firstName : ''),
      catchError((error) => {
        console.error('Error fetching first name:', error);
        return of('');  // default fallback value
      })
    );
  }

  getLastName(): Observable<String | undefined> {
    console.log(this.authService.getUserId());
    return this.authService.getUserId().pipe(
      switchMap((userId: String | null) => {
        if (userId) {
          // Since getUserId returns an Observable, we handle the ID inside this switchMap
          return this.getUser(userId);
        } else {
          return of(null);
        }
      }),
      map((user: User | null) => user ? user.lastName : ''),
      catchError((error) => {
        console.error('Error fetching last name:', error);
        return of('');  // default fallback value
      })
    );
  }

  


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl);
  }

  getUser(id: any): Observable<User> {
    return this.http.get<User>(`${baseUrl}/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
