package com.medisense.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medisense.backend.models.User;

public interface UserRepository extends JpaRepository<User, String> {

}
