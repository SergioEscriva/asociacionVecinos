package com.asociacion.repositories;

import com.asociacion.models.Admin;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRepository extends CrudRepository<Admin, Integer> {

    @Query("SELECT c FROM Admin c WHERE user = :user AND password = :password ")
    List<Admin> findByUserAndPassword(@Param("user") String email, @Param("password") String password);

}
