import { Component, OnInit, ViewChild } from '@angular/core';
import { Medication } from '../models/medication.model';
import { MedicationsListComponent } from '../medications-list/medications-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css']
})
export class PatientPortalComponent implements OnInit {
  
  medications: Medication[] = [];
  userFirstName?: String;

  @ViewChild(MedicationsListComponent, { static: false }) 
  medicationsListComponent!: MedicationsListComponent; 

  constructor(private route: ActivatedRoute) { }


  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['user'];
    if (resolvedData) {
      this.userFirstName = resolvedData.firstName;
    }
  }

  handleResults($event: any) {
    throw new Error('Method not implemented.');
  }

  onMedicationAdded(newMedication: Medication): void {
    this.medications.push(newMedication);
    this.medicationsListComponent.fetchUserMedications();
  }
}
