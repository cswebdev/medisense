import { Component, OnInit } from '@angular/core';
import { MedicationComponent } from '../medication/medication.component';
import { AuthService } from '../services/auth.service';
import { Medication } from '../models/medication.model';
import { MedicationService } from '../services/medication.service';
import { MedicationResponse } from '../models/medication-response.model';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css']
})
export class PatientPortalComponent implements OnInit {

  userId: number | undefined;
  medications: Medication[] = [];
  newMedication: Medication = {
    prescriptionName: ''
  };

  constructor(
    private authService: AuthService,
    private medicationService: MedicationService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getLoggedInUser()?.user_id;
    this.fetchMedications();
  }

  fetchMedications() {
    if (this.userId) {
      this.medicationService.getMedicationsByUserId(this.userId).subscribe((response: MedicationResponse) => {
        this.medications = response.medications;
      });
    } else {
      console.error("User ID is not available");
    }
  }

  addMedication() {
    if (this.userId) {
      this.medicationService.addMedicationToUser(this.userId, this.newMedication).subscribe(response => {
        this.medications.push(response.medications[0]);  
        this.newMedication = {}; 
      });
    } else {
      console.error("User ID is not available");
    }
  }
}
