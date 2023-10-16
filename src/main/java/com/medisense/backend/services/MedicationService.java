package com.medisense.backend.services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.medisense.backend.payload.response.DrugInfoResponse;

public class MedicationService {

    @Value("${my.api.key}")
    private String apiKey;

    public List<String> searchMedicationNames(String medication) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://rxnav.nlm.nih.gov/REST/drugs.json?name=" + medication;
        ResponseEntity<DrugInfoResponse> response = restTemplate.getForEntity(url, DrugInfoResponse.class);

        DrugInfoResponse drugInfo = response.getBody();

        if (response.getStatusCode().is2xxSuccessful() && drugInfo != null && drugInfo.getDrugGroup() != null && drugInfo.getDrugGroup().getConceptProperties() != null) {
            return response.getBody().getDrugGroup().getConceptProperties().stream()
                .map(DrugInfoResponse.DrugConcept::getName)
                .collect(Collectors.toList());
        } else {
            return Collections.emptyList();
        }
    }

}
