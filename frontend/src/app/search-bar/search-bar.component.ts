import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicationService } from '../services/medication.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  showResults: boolean = false;

  searchTerm: string = '';
  results: any[] = [];
  constructor(private medicationService: MedicationService) {}

  shortenMedicationName(name: string): string {
    const parts = name.split('/');
    return parts[0].trim();
}


  searchMedication() {
    console.log(this.searchTerm);
    this.medicationService.searchMedicationNames(this.searchTerm).subscribe(data => {
      const extractedNames = [];
      this.showResults = this.results.length > 0 

      const conceptGroup = data.drugGroup.conceptGroup || [];
      for (let group of conceptGroup) {
        if (group.conceptProperties) {
          for (let prop of group.conceptProperties) {
            extractedNames.push(this.shortenMedicationName(prop.name))
          }
        }
      }
      this.results = extractedNames;
      console.log("Extracted medication names:", this.results);
    }, error => {
      console.error("There was an error making this request:", error)
    });
  }


}
