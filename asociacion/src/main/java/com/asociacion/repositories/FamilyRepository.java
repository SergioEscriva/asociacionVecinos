package com.asociacion.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.asociacion.models.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

    Optional<Family> findByFamilyMasterNumber(Long familyMasterNumber);

    Optional<Family> findByMemberNumber(Long memberNumber);

    // List<Family> findAllByFamilyMasterNumber(Long familyMasterNumber);

    @Query("SELECT m FROM Family m WHERE m.familyMasterNumber = :familyMasterNumber")
    List<Family> findAllByFamilyMasterNumber(Long familyMasterNumber);

}
