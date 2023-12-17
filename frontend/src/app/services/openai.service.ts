  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable, catchError } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class OpenAIService {

    
    private backendUrl = 'http://localhost:8080/api/openai'; 
    constructor(private http: HttpClient) {}
      
    callOpenAI(prompt: string): Observable<any> {
      const requestBody = {
        input: prompt,
        model: 'text-embedding-ada-002', 
        encoding_format: 'float', 
      };
    
      return this.http.post<any>(`${this.backendUrl}/ask`, requestBody);
    }
    
  } 


