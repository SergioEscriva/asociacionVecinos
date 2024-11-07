package com.asociacion.repositories;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.asociacion.models.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {


}
