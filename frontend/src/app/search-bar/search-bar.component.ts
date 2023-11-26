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
    const pattern = /(\d+(\.\d+)?\s*(mg|g|mcg|µg|ml|mL|L|U|IU|mEq|%))/i;
    const match = name.match(pattern);
    return match ? match[0] : null;
  }

  shortenMedicationName(name: string): string {
    const dosage = this.getDosage(name);
    const primaryName = name.split(' ')[0];
    return primaryName;
  }

  searchMedication() {
    if(this.isDropdownOpen) {
      this.isDropdownOpen = false;
      this.searching = false;
      return;
    }

    this.medicationService.searchMedicationNames(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
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
      }, error => {
        console.error("There was an error making this request:", error)
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
