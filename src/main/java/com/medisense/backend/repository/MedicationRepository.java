package com.medisense.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.medisense.backend.models.Medication;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    
    List<Medication> findByUserId(String userId);


    @Modifying
    @Transactional
    @Query("delete from Medication m where m.userId = ?1")
    void deleteAllByUserId(String userId);
}
