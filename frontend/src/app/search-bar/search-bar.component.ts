import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MedicationService } from '../services/medication.service';
import { AuthService } from '../services/auth.service';
import { Medication } from '../models/medication.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnDestroy {
  showResults: boolean = false;
  searchTerm: string = '';
  results: any[] = [];
  searching = false;
  focusOnList = true;
  isDropdownOpen: boolean = false;
  dosages: (string | null)[] = [];
  medications: any[] = [];
  newMedication: string = '';

  private destroy$ = new Subject<void>();

  constructor(public authService: AuthService, private medicationService: MedicationService) {}

  onInputBlur() {
    this.searching = false;
    setTimeout(() => {
      if (!this.focusOnList) {
        this.showResults = false;
      }
    }, 100);
  }

  onInputFocus() {
    this.searching = true;
  }

  onMouseOut() {
    this.focusOnList = false;
    setTimeout(() => {
      if (!this.searching) {
        this.showResults = false;
      }
    }, 10000);
  }

  getDosage(name: string): string | null {
    name = name.trim();
  
    // Regular expression to match dosage patterns
    const pattern = /(\d+(\.\d+)?\s*(mg|g|mcg|µg|ml|mL|L|U|IU|mEq|%))/i;
  
    // Check if the dosage pattern is found in the name
    const match = name.match(pattern);
  
    // Check if the dosage is a combination of numbers without a clear medication name
    const containsNumbersOnly = /^\d+\s*\d*\s*(mg|g|mcg|µg|ml|mL|L|U|IU|mEq|%)$/i.test(name);
  
    // Return null if dosage pattern is not found or if it contains only numbers
    return match && !containsNumbersOnly ? match[0] : null;
  }
  

  shortenMedicationName(name: string): string {
    const dosage = this.getDosage(name);
    const primaryName = name.split(' ')[0];
    return primaryName;
  }

  searchMedication() {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
      this.searching = false;
      return;
    }
  
    this.medicationService.searchMedicationNames(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const uniquePrescriptions = new Set<string>();
        const sortedPrescriptions: { name: string; dosage: string | null }[] = [];
  
        const conceptGroup = data.drugGroup.conceptGroup || [];
        for (let group of conceptGroup) {
          if (group.conceptProperties) {
            for (let prop of group.conceptProperties) {
              const excludedPrefixes = ['{', '12', '24', '84', '90','168', '250','500', '750', '1000'];
  
              if (!excludedPrefixes.some(prefix => prop.name.startsWith(prefix))) {
                const shortenedName = this.shortenMedicationName(prop.name);
                const dosage = this.getDosage(prop.name);
  
                // Combine prescription name and dosage to check for uniqueness
                const combined = `${shortenedName} ${dosage || ''}`;
  
                if (!uniquePrescriptions.has(combined)) {
                  uniquePrescriptions.add(combined);
                  sortedPrescriptions.push({ name: shortenedName, dosage });
                }
              }
            }
          }
        }
  
        // Sort the prescriptions based on dosage
        sortedPrescriptions.sort((a, b) => {
          // Convert dosages to numbers for proper numeric sorting
          const dosageA = parseFloat(a.dosage || '0');
          const dosageB = parseFloat(b.dosage || '0');
          return dosageA - dosageB;
        });
  
        // Update the results and dosages arrays
        this.results = sortedPrescriptions.map(item => item.name);
        this.dosages = sortedPrescriptions.map(item => item.dosage);
  
        this.showResults = this.results.length > 0;
      }, error => {
        console.error("There was an error making this request:", error);
      });
  
    this.isDropdownOpen = true;
  }
  

  onSearchTermChange() {
    if (!this.searchTerm.trim()) {
      this.results = [];
    }
  }

  addMedication(result: string, index: number) {
    const primaryName = result;
    const dosage = this.dosages[index];

    const medicationData: Partial<Medication> = {
      prescriptionName: primaryName,
      dose: dosage
    };

    this.authService.getUserId().pipe(takeUntil(this.destroy$)).subscribe(userId => {
      if (userId) {
        this.medicationService.addMedicationToUser(userId, medicationData).subscribe(
          data => {
            this.medications.push(data);
            this.searchTerm = ''; 
          },
          error => {
            console.error('Error adding medication:', error);
          }
        );
      } else {
        console.error('User is not logged in or UID is not available.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
