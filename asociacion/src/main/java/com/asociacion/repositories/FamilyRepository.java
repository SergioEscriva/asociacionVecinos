package com.asociacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.asociacion.models.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

}
