import { Component, OnInit, ViewChild } from '@angular/core';
import { Medication } from '../models/medication.model';
import { MedicationsListComponent } from '../medications-list/medications-list.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MedicationService } from '../services/medication.service';
import { Subscription } from 'rxjs';
import { OpenAIService } from '../services/openai.service';
import { ChatService } from '../services/chat.service';

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

  @ViewChild(MedicationsListComponent) 
  medicationsListComponent!: MedicationsListComponent; 

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private medicationService: MedicationService,
    private openAIService: OpenAIService,
    private chatService: ChatService,
  ) { }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['user'];
    if (resolvedData) {
      this.userFirstName = resolvedData.firstName;

      this.fetchUserMedications();
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

  fetchUserMedications() {
    this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.medicationService.getMedicationsByUserId(userId)
          .subscribe(
            response => {
              this.medications = response.medications;
            },
            error => {
              console.error('Error fetching medications:', error);
            }
          );
      }
    });
  }

  onMedicationAdded(newMedication: Medication): void {
    this.medications.push(newMedication);
    this.medicationsListComponent.fetchUserMedications();
  }

  onEditSave(): void {
    this.medicationsListComponent.saveFrequency(this.medicationsListComponent.medications[0]);
  }

  analyzeMedications() {
    const prescriptionNames = this.medications.map(med => med.prescriptionName);

    if (prescriptionNames.length === 0) {
      console.warn('No medications found. Cannot analyze.');
      return;
    }

    const prompt = `Analyzing medications: ${prescriptionNames.join(',')}. `;
   
    this.openAIService.callOpenAI(prompt)
      .subscribe(response => {
        const assistantResponse = response.choices[0]?.message.content;
        this.chatService.updateChatContent(assistantResponse);
        console.log('OpenAI Response:', response);
      }, error => {
        console.error('OpenAI API Error:', error);
      });
  }
}
