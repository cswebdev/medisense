package com.medisense.backend.controller;

import java.util.Collections;
import java.util.Map;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

	private static final Logger logger = LoggerFactory.getLogger(MedicationController.class);

	@Autowired
	private MedicationRepository medicationRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/users/{userId}/medications")
	public ResponseEntity<MedicationResponse> getAllMedicationsByUserID(@PathVariable("userId") String userId) {
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
			@PathVariable("userId") String userId,
			@RequestBody Medication medication) {
		MedicationResponse response = new MedicationResponse();

		// Check if the user exists.
		Optional<User> userOptional = userRepository.findById(userId);
		if (!userOptional.isPresent()) {
			response.setMessage("User not found");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		// Set the userId to the medication object
		medication.setUserId(userId);

		try {
			// Save the medication
			Medication savedMedication = medicationRepository.save(medication);

			response.setMedications(Collections.singletonList(savedMedication));
			response.setMessage("Medication added successfully.");
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} catch (Exception e) {
			logger.error("Error while adding the medication", e); // This will log the error details
			response.setMessage("An error occurred while adding the medication");
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/users/{userId}/medications/{medicationId}")
	@Transactional
	public ResponseEntity<MedicationResponse> updateMedication(
			@PathVariable("userId") String userId,
			@PathVariable("medicationId") Long medicationId,
			@RequestBody Medication medicationDetails) {

		MedicationResponse response = new MedicationResponse();

		// First, check if the user exists
		Optional<User> userOptional = userRepository.findById(userId);
		if (!userOptional.isPresent()) {
			response.setMessage("User not found");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		Optional<Medication> medicationOptional = medicationRepository.findById(medicationId);
		if (!medicationOptional.isPresent()) {
			response.setMessage("Medication not found");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		Medication existingMedication = medicationOptional.get();
		if (!existingMedication.getUserId().equals(userId)) {
			response.setMessage("Medication does not belong to the user");
			return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
		}

		existingMedication.setFrequency(medicationDetails.getFrequency());

		try {
			Medication updatedMedication = medicationRepository.save(existingMedication);

			response.setMedications(Collections.singletonList(updatedMedication));
			response.setMessage("Medication updated successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error while updating the medication", e);
			response.setMessage("An error occurred while updating the medication");
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Value("${my.api.key}")
	private String apiKey;

	@GetMapping("/search-medication")
	public ResponseEntity<String> searchMedication(@RequestParam String medication) {
		RestTemplate restTemplate = new RestTemplate();
		String url = "https://rxnav.nlm.nih.gov/REST/drugs.json?name=" + medication;
		ResponseEntity<String> externalResponse = restTemplate.getForEntity(url, String.class);
		return new ResponseEntity<>(externalResponse.getBody(), HttpStatus.OK);
	}

	@DeleteMapping("/users/{userId}/medications/all")
	@Transactional
	public ResponseEntity<Map<String, String>> deleteAllMedicationsByUserId(@PathVariable("userId") String userId) {
		Optional<User> userOptional = userRepository.findById(userId);
		if (!userOptional.isPresent()) {
			return new ResponseEntity<>(Collections.singletonMap("message", "User not found"), HttpStatus.NOT_FOUND);
		}
		try {
			medicationRepository.deleteAllByUserId(userId);
			return new ResponseEntity<>(Collections.singletonMap("message", "All medications deleted successfully for user " + userId), HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error while deleting medications for user " + userId, e);
			return new ResponseEntity<>(Collections.singletonMap("message", "An error occurred while deleting the medications"), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
