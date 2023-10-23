package com.medisense.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.FirebaseAuthException;
import com.medisense.backend.models.User;
import com.medisense.backend.models.UserRegistrationDTO;
import com.medisense.backend.repository.UserRepository;
import com.medisense.backend.services.FirebaseService;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1")
public class UserController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private FirebaseService firebaseService;

	// get all users
	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers() {
		try {
			List<User> users = new ArrayList<User>();
			userRepository.findAll().forEach(users::add);
			if (users.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(users, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// get user by id
	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
		Optional<User> userData = userRepository.findById(id);

		if (userData.isPresent()) {
			return new ResponseEntity<>(userData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/users")
	public ResponseEntity<?> createUser(@RequestBody UserRegistrationDTO userDTO) {
		try {
			FirebaseToken decodedToken = firebaseService.verifyToken(userDTO.getIdToken());
			String uid = decodedToken.getUid();
			
			Optional<User> existingUser = userRepository.findById(uid);
			if (existingUser.isPresent()) {
				return new ResponseEntity<>("User already exists!", HttpStatus.BAD_REQUEST);
			}

			User _user = userRepository.save(new User(	
				uid,
				userDTO.getFirstName(), 
				userDTO.getLastName()
			));
			
			return new ResponseEntity<>(_user, HttpStatus.CREATED);
		} catch (Exception e) {
			// General error handling
			if (e instanceof FirebaseAuthException) {
				// Handle Firebase specific exceptions
				return new ResponseEntity<>("Error with Firebase authentication: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
			}
			return new ResponseEntity<>("Error registering user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	

	// update user info
	@PutMapping("/users/{id}")
	public ResponseEntity<?> updateUser(@PathVariable("id") String id, @RequestBody UserRegistrationDTO userDTO) {
    	return userRepository.findById(id)
        .map(existingUser -> {
            existingUser.setFirstName(userDTO.getFirstName());
            existingUser.setLastName(userDTO.getLastName());
            return new ResponseEntity<>(userRepository.save(existingUser), HttpStatus.OK);
        })
        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete user by id
	@DeleteMapping("/users/{id}")
	public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") String id) {
		try {
			userRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
