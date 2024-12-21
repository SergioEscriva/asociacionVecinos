package com.asociacion.repositories;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociacion.models.Activity;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query ("SELECT a FROM Activity a WHERE name LIKE %:name%")
    List<Activity> findActivityByName(@Param("name") String name);

    @Query ("SELECT a FROM Activity a ORDER BY a.name")
    List<Activity> getActivitiesOrderByName();

}
