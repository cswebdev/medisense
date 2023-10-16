package com.medisense.backend.models;

import com.medisense.backend.models.User;

public class UserRegistrationDTO {

    private User user;
    private String idToken;

    // Default constructor
    public UserRegistrationDTO() {}

    // Parameterized constructor
    public UserRegistrationDTO(User user, String idToken) {
        this.user = user;
        this.idToken = idToken;
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
