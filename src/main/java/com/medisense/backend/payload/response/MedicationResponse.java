package com.medisense.backend.payload.response;

import java.util.List;

import com.medisense.backend.models.Medication;

public class MedicationResponse {
    private String message;
    private List<Medication> medications;

    // Getter and Setter for message
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Getter and Setter for medications
    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }
}
