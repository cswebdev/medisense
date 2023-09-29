import { Medication } from './medication.model';

export interface MedicationResponse {
    message: string;
    medications: Medication[];
}
