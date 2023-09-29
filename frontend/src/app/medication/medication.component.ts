import { Component, OnInit } from '@angular/core';
import { MedicationService } from '../services/medication.service';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {
  
  medications: any[] = [];
  newMedication: string = '';

  userId: number = 4;  // Static for now.

  constructor(private medicationService: MedicationService) { }

  ngOnInit(): void {
    this.fetchMedications();
  }

  fetchMedications() {
    this.medicationService.getMedicationsByUserId(this.userId).subscribe(
      (data: any) => {  // Explicitly type data or use a proper interface/type definition.
        this.medications = data.medications;  // Assuming the response has a 'medications' field.
      },
      error => {
        console.error('Error fetching medications:', error);
      }
    );
  }

  addMedication() {
    const medicationData = {
      prescriptionName: this.newMedication
      // Add other medication details here if needed.
    };

    this.medicationService.addMedicationToUser(this.userId, medicationData).subscribe(
      (data: any) => {  // Explicitly type data or use a proper interface/type definition.
        this.medications.push(data);
        this.newMedication = '';
      },
      error => {
        console.error('Error adding medication:', error);
      }
    );
  }
}
