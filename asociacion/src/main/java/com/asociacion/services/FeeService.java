package com.asociacion.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.asociacion.models.Fee;

public interface FeeService {

    Fee saveFee(Fee fee);

    List<Fee> findByMemberId(Long id);

    List<Fee> findLastFeeByMemberId(Long id);

    List<Fee> getFees();

    List<Fee> findFeesByDate(LocalDate startDate, LocalDate endDate);

    void delFeeById(Long id);

    Optional<Fee> findFeeById(Long id);

}
