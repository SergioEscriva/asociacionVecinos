package com.asociacion.repositories;

import java.lang.reflect.Member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociacion.models.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

}
