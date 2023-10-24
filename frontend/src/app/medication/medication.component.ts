import { Component, OnInit } from '@angular/core';
import { MedicationService } from '../services/medication.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {
  
  medications: any[] = [];
  newMedication: string = '';

  userId: number = 4;  // Static for now.
  authService: any;

  constructor(private medicationService: MedicationService, authService: AuthService) { }

  ngOnInit(): void {
    this.fetchUserMedications();
  }

  fetchUserMedications(): void {
    this.authService.getUserId().subscribe((userId: string) => {
      if (userId) {
        this.medicationService.getMedicationsByUserId(userId).subscribe(
          response => {
            if (response && response.medications) {
              this.medications = response.medications;
            }
          },
          error => {
            console.error('Error fetching medications:', error);
            alert('An error occurred while fetching medications. Please try again.');
          }
        );
      }
    });
  }
}