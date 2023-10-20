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

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAlert().subscribe((message) => {
      this.message = message;
    });
  }
  closeAlert() {
    this.message = null;
  }
}
