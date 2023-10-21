import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-global-alert',
  template: `
    <div *ngIf="message" class="alert alert-{{ message.type }} d-flex justify-content-center align-items-center" role="alert">
      <span class="me-2">{{ message.text }}</span>
      <button type="button" class="btn-close" (click)="closeAlert()" aria-label="Close"></button>
    </div>
  `,
})
export class GlobalAlertComponent implements OnInit {
  message: any;
  private timeoutId: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAlert().subscribe((message) => {
      this.message = message;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.closeAlert();
      }, 5000);  // 5 seconds
    });
  }

  ngOnDestroy() {
    // Clear the timeout when the component is destroyed
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  closeAlert() {
    this.message = null;
  }
}
