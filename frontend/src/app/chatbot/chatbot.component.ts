import { Component, OnInit } from '@angular/core';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  chatContent: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getChatContent().subscribe((content) => {
      this.chatContent = content;
    });
  }
  

 faPaperPlane = faPaperPlane
}
