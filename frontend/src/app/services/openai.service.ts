import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private backendUrl = 'http://localhost:8080/api/openai'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/ask`, { prompt });
  }
}
