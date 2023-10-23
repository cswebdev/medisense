package com.medisense.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.medisense.backend.models.User;

public interface UserRepository extends JpaRepository<User, String> {

}
