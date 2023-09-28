// package com.medisense.backend.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.medisense.backend.payload.request.LoginRequest;
// import com.medisense.backend.repository.UserRepository;
// import com.medisense.backend.security.config.services.UserDetailsImpl;

// import jakarta.validation.Valid;

// @CrossOrigin(origins = "http://localhost:4200")
// @RestController
// @RequestMapping("/api/v1")
// public class AuthController {

// @Autowired
// AuthenticationManager authenticationManager;

// @Autowired
// UserRepository userRepository;

// @Autowired
// PasswordEncoder encoder;

// @PostMapping("/signin")
// public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest
// loginRequest) {

// Authentication authentication = authenticationManager.authenticate(
// new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
// loginRequest.getPassword()));

// SecurityContextHolder.getContext().setAuthentication(authentication);

// UserDetailsImpl userDetails = (UserDetailsImpl)
// authentication.getPrincipal();

// return ResponseEntity.ok(new SimpleUserDetailsResponse(
// userDetails.getId(),
// userDetails.getUsername(),
// userDetails.getEmail()));
// }

// }
