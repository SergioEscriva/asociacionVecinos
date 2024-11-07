package com.asociacion.asociacion.repositories;

import java.lang.reflect.Member;
import java.rmi.registry.Registry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReistryRepository extends JpaRepository<Registry, Long> {


}
