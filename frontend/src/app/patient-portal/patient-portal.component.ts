import { Component, OnInit, ViewChild } from '@angular/core';
import { Medication } from '../models/medication.model';
import { MedicationsListComponent } from '../medications-list/medications-list.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MedicationService } from '../services/medication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css']
})
export class PatientPortalComponent implements OnInit {
  
  medications: Medication[] = [];
  userFirstName?: string;
  isEditing: boolean = false;
  private medicationListSub: Subscription = new Subscription;


  @ViewChild(MedicationsListComponent, { static: false }) 
  medicationsListComponent!: MedicationsListComponent; 

  constructor(private route: ActivatedRoute,
    public authService: AuthService,
    private medicationService: MedicationService) { }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    
  }

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['user'];
    if (resolvedData) {
      this.userFirstName = resolvedData.firstName;
    }
  }

  ngOnDestroy(): void {
    if (this.medicationListSub) {
      this.medicationListSub.unsubscribe();
    }
  }

  handleResults($event: any) {
    throw new Error('Method not implemented.');
  }

  onMedicationAdded(newMedication: Medication): void {
    this.medications.push(newMedication);
    this.medicationsListComponent.fetchUserMedications();
  }

  saveFrequency(medication: Medication): void {
    if (medication && medication.frequency) {
      const frequency: string = medication.frequency;
  
      this.authService.getUserId().subscribe(userId => {
        if (typeof userId === 'string' && userId.trim() !== '') {
          this.medicationService.updateMedicationFrequency(userId, medication.id, frequency).subscribe(
            () => {
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

