import { Component } from '@angular/core';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css']
})
export class PatientPortalComponent {
  public editToggled: boolean = false;
  public firstNameDisabled: boolean = true;
  public lastNameDisabled: boolean = true;
  public emailDisabled: boolean = true;
  public passwordDisabled: boolean = true;
  public saveDisabled: boolean = true;

  constructor(){}

  editToggle(){
    this.firstNameDisabled = this.editToggled;
    this.lastNameDisabled = this.editToggled;
    this.emailDisabled = this.editToggled;
    this.passwordDisabled = this.editToggled;
    this.saveDisabled = this.editToggled;
    this.editToggled = !this.editToggled;
  }
 }
