package com.asociacion.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.asociacion.models.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

    Optional<Family> findByFamilyMasterNumber(Long familyMasterNumber);

    List<Family> findAllByFamilyMasterNumber(Long familyMasterNumber);

    Optional<Family> findByMemberNumber(Long memberNumber);
}
