package com.medisense.backend.controller;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.medisense.backend.models.Medication;
import com.medisense.backend.models.User;
import com.medisense.backend.payload.response.MedicationResponse;
import com.medisense.backend.repository.MedicationRepository;
import com.medisense.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/v1")
public class MedicationController {

	@Autowired
	private MedicationRepository medicationRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/users/{userId}/medications")
	public ResponseEntity<MedicationResponse> getAllMedicationsByUserID(@PathVariable("userId") Long userId) {
		List<Medication> medications = medicationRepository.findByUserId(userId);
		MedicationResponse response = new MedicationResponse();

		if (medications != null && !medications.isEmpty()) {
			response.setMedications(medications);
			response.setMessage("Medications retrieved successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setMedications(Collections.emptyList());
			response.setMessage("No medications added to user medication list.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@PostMapping("/users/{userId}/medications")
	@Transactional
	public ResponseEntity<MedicationResponse> addMedicationToUser(
			@PathVariable("userId") Long userId,
			@RequestBody Medication medication) {
		MedicationResponse response = new MedicationResponse();

		// Check if the user exists.
		Optional<User> userOptional = userRepository.findById(userId);
		if (!userOptional.isPresent()) {
			response.setMessage("User not found");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		medication.setUser(userOptional.get());

		try {
			// Save the medication
			Medication savedMedication = medicationRepository.save(medication);

			response.setMedications(Collections.singletonList(savedMedication));
			response.setMessage("Medication added successfully.");
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} catch (Exception e) {
			response.setMessage("An error occured while adding the medication");
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@Value("${my.api.key}")
	private String apiKey;

	@GetMapping("/search-medication")
	public ResponseEntity<String> searchMedication(@RequestParam String medication) {
		RestTemplate restTemplate = new RestTemplate();
		String url = "https://rxnav.nlm.nih.gov/REST/drugs.json?name=" + medication;
		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
		return response;
	}
}
