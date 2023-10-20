import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new Subject<any>();

  constructor() {}

  getAlert(): Observable<any> {
    return this.alertSubject.asObservable();
  }

  success(message: string) {
    this.alertSubject.next({ type: 'success', text: message });
  }

  warning(message: string) {
    this.alertSubject.next({ type: 'warning', text: message });
  }
}
