import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private backendUrl = 'http://localhost:8080/api/openai'; 
  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/ask`, { prompt })
      .pipe(
        catchError((error) => {
          console.error('Error in OpenAIService:', error);
          throw error; 
        })
      );
  }
}
