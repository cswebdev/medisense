import { Component, OnInit } from '@angular/core';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../services/chat.service';
import { Medication } from '../models/medication.model';
import { MedicationService } from '../services/medication.service';
import { OpenAIService } from '../services/openai.service';
import { AuthService } from '../services/auth.service'; // Import your AuthService
import { MedicationResponse } from '../models/medication-response.model';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  chatContent: string = '';
  medications: Medication[] = [];
  userId: string | undefined; 

  constructor(
    private chatService: ChatService,
    private medicationService: MedicationService,
    private openAIService: OpenAIService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.chatService.getChatContent().subscribe((content) => {
      this.chatContent = content;
    });

    this.authService.getUserId().subscribe((userId: string | null) => {
      if (userId) {
        this.userId = userId;
    
        this.medicationService.getMedicationsByUserId(this.userId).subscribe(
          (response: MedicationResponse) => {
            this.medications = response.medications;
          },
          (error) => {
            console.error('Error fetching medications:', error);
          }
        );
      } else {
        console.error('User ID is null.');
      }
    });
  }

  analyzeMedications() {
    if (!this.userId) {
      console.error('User ID is not defined.');
      return;
    }

    const prescriptionNames = this.medications.map((med) => med.prescriptionName);

    if (prescriptionNames.length === 0) {
      console.warn('No medications found. Cannot analyze.');
      return;
    }

    const prompt = `Analyzing medications: ${prescriptionNames.join(', ')}. `;

    this.openAIService.callOpenAI(prompt).subscribe(
      (response: { choices: { message: { content: any } }[] }) => {
        const assistantResponse = response.choices[0]?.message.content;
        this.chatService.updateChatContent(assistantResponse.replace(/\n/g, '<br>'));
        console.log('OpenAI Response:', response);
      },
      (error: any) => {
        console.error('OpenAI API Error:', error);
      }
    );
  }

  faPaperPlane = faPaperPlane;
}
