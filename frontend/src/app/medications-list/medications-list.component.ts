import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MedicationService } from '../services/medication.service';
import { Medication } from '../models/medication.model';

@Component({
  selector: 'app-medications-list',
  templateUrl: './medications-list.component.html',
  styleUrls: ['./medications-list.component.css']
})
export class MedicationsListComponent implements OnInit {

  medications: Medication[] = [];

  constructor(public authService: AuthService, private medicationService: MedicationService) { }

  ngOnInit(): void {
    this.fetchUserMedications();
  }

  fetchUserMedications(): void {
    this.authService.getUserId().subscribe(userId => {
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
