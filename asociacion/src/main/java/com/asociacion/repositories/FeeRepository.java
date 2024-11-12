package com.asociacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.asociacion.models.Fee;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {

}
