  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, Subject, catchError, tap } from 'rxjs';
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
      return this.http.get<MedicationResponse>(`${this.baseUrl}/${userId}/medications`)
        .pipe(
          tap((response) => {
            console.log('Fetched Medications:', response);
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Error fetching medications:', error);
            throw error; 
          })
        );
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
    
    deleteMedication(userId: string, medicationId: number): Observable<any> {
      const url = `${this.baseUrl}/${userId}/medications/${medicationId}`;
      return this.http.delete(url).pipe(
        tap(() => {
          this.medicationChanged.next();
        })
      );
    }

    searchMedicationNames(medicationName: string): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/search-medication`, {
        params: { medication: medicationName }
      });
    }

    updateMedicationFrequency(userId: string | null | undefined, medicationId: number | undefined, frequency: string): Observable<any> {
      if (userId === undefined || userId === null) {
         throw Error('User ID is undefined or null');
      }
    
      if (medicationId === undefined) {
         throw Error('Medication ID is undefined');
      }
    
      const url = `${this.baseUrl}/${userId}/medications/${medicationId}`;
      const body = { frequency };
    
      return this.http.put(url, body).pipe(
        tap(() => {
          this.medicationChanged.next();
        })
      );
    }

    deleteAllMedicationsByUserId(userId: string): Observable<any> {
      return this.http.delete(`${this.baseUrl}/${userId}/medications/all`);
    }    
  }
