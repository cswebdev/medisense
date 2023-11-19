import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MedicationService } from '../services/medication.service';
import { Medication } from '../models/medication.model';
import { Subscription } from 'rxjs';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-medications-list',
  templateUrl: './medications-list.component.html',
  styleUrls: ['./medications-list.component.css']
})
export class MedicationsListComponent implements OnInit, OnDestroy {
  @Input() isEditing!: boolean;

  medications: Medication[] = [];
  private medicationListSub: Subscription = new Subscription;

  faTrashcan = faTrashCan;

  constructor(public authService: AuthService, private medicationService: MedicationService) { }
  ngOnInit(): void {
    this.fetchUserMedications();
    this.medicationListSub = this.medicationService.getMedicationChangedObservable().subscribe(() => {
      this.fetchUserMedications();
    });
  }

  toggleEdit() {
    this.isEditing =!this.isEditing;
  }

  onEditSave(): void {
    this.medications.forEach(medication => {
      this.saveFrequency(medication);
    });
  }

  ngOnDestroy(): void {
    if (this.medicationListSub) {
      this.medicationListSub.unsubscribe();
    }
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

  saveFrequency(medication: Medication): void {
    // Check if the medication id and frequency are valid
    if (medication && medication.id) {
      const frequency = medication.frequency || 'default value'; // Provide a default value if frequency is null
  
      this.authService.getUserId().subscribe(userId => {
        if (userId) {
          // Update medication frequency - allowing frequency to be null if that's valid
          this.medicationService.updateMedicationFrequency(userId, medication.id, frequency).subscribe(
            () => {
              // Handle successful update
            },
            error => {
              console.error('Error updating frequency:', error);
            }
          );
        }
      });
    } 
  }
}
