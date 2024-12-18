package com.asociacion.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.asociacion.models.Registry;

@Repository
public interface RegistryRepository extends JpaRepository<Registry, Long> {

    @Query("SELECT m FROM Registry m WHERE m.memberId = :memberId")
    List<Registry> findByMemberId(Long memberId);

    @Query("SELECT m FROM Registry m ORDER BY m.memberId")
    List<Registry> getRegistriesOrderByMemberId();

}
