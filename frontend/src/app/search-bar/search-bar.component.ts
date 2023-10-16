import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicationService } from '../services/medication.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  searchTerm: string = '';
  results: any[] = [];

  // constructor(private http: HttpClient){};
  constructor(private medicationService: MedicationService) {}

  searchMedication() {
    const url = `http://localhost:8080/api/v1/search-medication?medication=${this.searchTerm}`;
   
  console.log(this.searchTerm)
  this.medicationService.searchMedicationNames(this.searchTerm).subscribe(data => {
    
    console.log("Response data:", data);
    this.results = data;

    console.log("results array:", this.results);

    this.results.forEach(medication => {
      console.log(medication)
    })
  }, error => {
    console.error("There was an error making the request:", error);
  });
  }
}
