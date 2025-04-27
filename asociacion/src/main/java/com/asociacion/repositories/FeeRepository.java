package com.asociacion.repositories;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociacion.models.Fee;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    @Query("SELECT m FROM Fee m WHERE m.memberId = :memberId")
    List<Fee> findByMemberId(Long memberId);

    @Query("SELECT m FROM Fee m WHERE m.memberId = :memberId ORDER BY m.year DESC")
    List<Fee> findLastFeeByMemberId(Long memberId);

@Query("SELECT m FROM Fee m WHERE m.date BETWEEN :startDate AND :endDate")
List<Fee> findFeesByDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


}
