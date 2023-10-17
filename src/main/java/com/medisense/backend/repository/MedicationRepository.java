package com.medisense.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medisense.backend.models.Medication;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    
    List<Medication> findByUserId(Long userId);

}
