import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatContentSubject = new BehaviorSubject<string>(''); 
  
  getChatContent() {
    return this.chatContentSubject.asObservable();
  }

  updateChatContent(content:string){
    this.chatContentSubject.next(content);
  }

  clearChatContent() {
    this.updateChatContent('');
  }
}
