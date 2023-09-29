import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Medication } from '../models/medication.model';
import { MedicationsListComponent } from '../medications-list/medications-list.component';


@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css']
})
export class PatientPortalComponent implements OnInit {

  loggedInUser: any;
  medications: Medication[] = [];

  @ViewChild(MedicationsListComponent, { static: false }) 
  medicationsListComponent!: MedicationsListComponent; 

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
  } 

  onMedicationAdded(newMedication: Medication) {
    this.medications.push(newMedication);
    this.medicationsListComponent.fetchUserMedications();

  }
  
}
