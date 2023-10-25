  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable, Subject, tap } from 'rxjs';
  import { Medication } from '../models/medication.model';
  import { MedicationResponse } from '../models/medication-response.model';

  @Injectable({
    providedIn: 'root'
  })
  export class MedicationService {

    private baseUrl: string = 'http://localhost:8080/api/v1/users';
    private apiBaseUrl: string = 'http://localhost:8080/api/v1';

    private medicationChanged = new Subject<void>();

    constructor(private http: HttpClient) { }

    getMedicationsByUserId(userId: string): Observable<MedicationResponse> {
      return this.http.get<MedicationResponse>(`${this.baseUrl}/${userId}/medications`);
    }

    getMedicationChangedObservable(): Observable<void> {
      return this.medicationChanged.asObservable();
    }

    addMedicationToUser(userId: string, medication: Medication): Observable<MedicationResponse> {
      return this.http.post<MedicationResponse>(`${this.baseUrl}/${userId}/medications`, medication).pipe(
        tap(() => {
          this.medicationChanged.next();
        })
      );
    }
    

    // New method to search for medication names
    searchMedicationNames(medicationName: string): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/search-medication`, {
        params: { medication: medicationName }
      });
    }
  }
