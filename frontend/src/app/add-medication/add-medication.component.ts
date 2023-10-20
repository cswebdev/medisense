import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MedicationService } from '../services/medication.service';
import { Medication } from '../models/medication.model';

@Component({
  selector: 'app-add-medication',
  templateUrl: './add-medication.component.html',
  styleUrls: ['./add-medication.component.css']
})
export class AddMedicationComponent {

  medication: Medication = {};

  @Output() medicationAdded = new EventEmitter<Medication>();

  constructor(public authService: AuthService, private medicationService: MedicationService) { }

  onSubmit(): void {
    // const loggedInUser = this.authService.getLoggedInUser();
    // if (loggedInUser && loggedInUser.id) {
    //   this.medicationService.addMedicationToUser(loggedInUser.id, this.medication).subscribe(
    //     response => {
    //       if (response && response.message) {
    //         alert(response.message);
    //         if (response.medications && response.medications[0]) {
    //           this.medicationAdded.emit(response.medications[0]);
    //         }
    //       }
    //     },
    //     error => {
    //       console.error('Error adding medication:', error);
    //       alert('An error occurred. Please try again.');
    //     }
    //   );
    // }
  }
}
