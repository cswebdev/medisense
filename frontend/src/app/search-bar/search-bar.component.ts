import { Component } from '@angular/core';
import { MedicationService } from '../services/medication.service';
import { AuthService } from '../services/auth.service';
import { Medication } from '../models/medication.model';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  showResults: boolean = false;

  searchTerm: string = '';
  results: any[] = [];
  
  searching = false;
  focusOnList = true;

  dosages: (string | null)[] = [];


  constructor(public authService: AuthService, private medicationService: MedicationService) {}

  // Method called when input field loses focus
  onInputBlur() {
    this.searching = false;

    setTimeout(() => {
      if (!this.focusOnList) {
        this.showResults = false;
      }
    }, 100);
  }

  // Method called when input field gets focus
  onInputFocus() {
    this.searching = true;
  }

  // Method called when mouse is out of the search container
  onMouseOut() {
    this.focusOnList = false;

    // Add a delay to ensure dropdown doesn't disappear immediately
    // when moving between the input and dropdown or within dropdown items.
    setTimeout(() => {
      if (!this.searching) {
        this.showResults = false;
      }
    }, 10000);
  }

  shortenMedicationName(name: string): string {
    const dosage = this.getDosage(name);
    const primaryName = name.split(' ')[0]; // Usually, the first word is the primary name

    if (dosage) {
        return `${primaryName} ${dosage}`;
    }

    return primaryName;
}

  getDosage(name: string): string | null {
    name = name.trim();
    const pattern = /(\d+(\.\d+)?\s*(mg|g|mcg|µg|ml|mL|L|U|IU|mEq|%))/i;
    const match = name.match(pattern);
    console.log("Match result for", name, ":", match);
    return match ? match[0] : null;
}



  searchMedication() {
    console.log(this.searchTerm);
    this.medicationService.searchMedicationNames(this.searchTerm).subscribe(data => {
      const extractedNames = [];
      const extractedDosages = [];

      this.showResults = this.results.length > 0;

      const conceptGroup = data.drugGroup.conceptGroup || [];
      for (let group of conceptGroup) {
        if (group.conceptProperties) {
          for (let prop of group.conceptProperties) {
            if (!prop.name.startsWith('{')) {
              const shortenedName = this.shortenMedicationName(prop.name);
              const dosage = this.getDosage(prop.name);

              extractedNames.push(shortenedName);
              extractedDosages.push(dosage);
            }
          }
        }
      }
      this.results = extractedNames;
      this.dosages = extractedDosages;
      console.log("Extracted medication names:", this.results);

    }, error => {
      console.error("There was an error making this request:", error)
    });
  }

  onSearchTermChange() {
    if (!this.searchTerm.trim()) {
      this.results = [];
     
    }
  }


  addMedication(result: string, index: number) {
    const primaryName = result.split(' ')[0]; 
    
    console.log("Selected medication:", primaryName);
    console.log("Dosage for the medication:", this.dosages[index]);
  }
  
}