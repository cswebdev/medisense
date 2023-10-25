import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of, retryWhen, scan, delay } from 'rxjs';
import { User } from '../models/user.model';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const baseUrl = 'http://localhost:8080/api/v1/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFirstName(): Observable<string | undefined> {
    console.log(this.authService.getUserId());
    return this.authService.getUserId().pipe(
      switchMap((userId: string | null) => {
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

  getLastName(): Observable<string | undefined> {
    console.log(this.authService.getUserId());
    return this.authService.getUserId().pipe(
      switchMap((userId: string | null) => {
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

  getUser(id: any): Observable<User | null> {
    console.log('get user');
    return this.http.get<User>(`${baseUrl}/${id}`).pipe(
      retryWhen(errors =>
        errors.pipe(
          // Use the scan operator to keep track of the number of retries
          scan((retryCount, error) => {
            if (retryCount >= 3 || error.status === 404) {
              // If the maximum number of retries is reached or the error status is 404,
              // throw the error to be caught by catchError
              throw error;
            }
            return retryCount + 1;
          }, 0),
          // Delay between retries
          delay(1000)
        )
      ),
      catchError((error) => {
        if (error.status === 404) {
          console.error('User not found:', error);
          return of(null); // or return a default value or handle it in a way that makes sense for your application
        }
        // Handle other error types here
        console.error('Error fetching user:', error);
        return throwError(error);
      })
    );
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
