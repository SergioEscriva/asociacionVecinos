package com.asociacion.repositories;




import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.asociacion.models.Registry;

@Repository
public interface RegistryRepository extends JpaRepository<Registry, Long> {


}
