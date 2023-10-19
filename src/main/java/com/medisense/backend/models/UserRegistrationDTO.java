package com.medisense.backend.models;

public class UserRegistrationDTO {

    private String idToken;
    private String firstName;
    private String lastName;

    // Default constructor
    public UserRegistrationDTO() {}

    // Parameterized constructor
    public UserRegistrationDTO(String idToken, String firstName, String lastName) {
        this.idToken = idToken;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
    public String getIdToken() {
        return idToken;
    }
    
    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
