import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medication } from '../models/medication.model';
import { MedicationResponse } from '../models/medication-response.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  private baseUrl: string = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }

  getMedicationsByUserId(userId: number): Observable<MedicationResponse> {
    return this.http.get<MedicationResponse>(`${this.baseUrl}/${userId}/medications`);
  }

  addMedicationToUser(userId: number, medication: Medication): Observable<MedicationResponse> {
    return this.http.post<MedicationResponse>(`${this.baseUrl}/${userId}/medications`, medication);
  }
}