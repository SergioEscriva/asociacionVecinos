package com.asociacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.asociacion.models.Config;

import java.util.List;


public interface ConfigRepository extends JpaRepository<Config, Long> {

    @Query("SELECT a FROM Config a WHERE configOption LIKE %:configOption%")
    List<Config> findConfigByOption(@Param("configOption") String configOption);

}
