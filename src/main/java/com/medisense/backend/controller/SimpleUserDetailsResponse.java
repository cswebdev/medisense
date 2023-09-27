package com.medisense.backend.controller;

public class SimpleUserDetailsResponse {
    private String username;
    private String email;
    private Long id;

    public SimpleUserDetailsResponse(Long id, String email, String username) {
        this.username = username;
        this.email = email;
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
