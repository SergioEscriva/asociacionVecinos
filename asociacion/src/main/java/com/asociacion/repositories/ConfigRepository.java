package com.asociacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociacion.models.Config;

import java.util.List;

@Repository
public interface ConfigRepository extends JpaRepository<Config, Long> {

    @Query("SELECT a FROM Config a WHERE option LIKE %:option%")
    List<Config> findConfigByOption(@Param("option") String option);

}
