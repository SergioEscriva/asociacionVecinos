package com.asociacion.services;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Fee;
import com.asociacion.repositories.FeeRepository;

@Service
public class FeeServiceImp implements FeeService {

    @Autowired
    private FeeRepository feeRepository;

    @Override
    public Fee saveFee(Fee fee) {
        return feeRepository.save(fee);
    }

    @Override
    public List<Fee> findByMemberId(Long memberId) {
        return feeRepository.findByMemberId(memberId);
    }

    @Override
    public List<Fee> findLastFeeByMemberId(Long memberId) {
        return feeRepository.findLastFeeByMemberId(memberId);
    }

    @Override
    public List<Fee> getFees() {

        return feeRepository.findAll();
    }

    @Override
    public List<Fee> findFeesByDate(LocalDate date) {
        return feeRepository.findFeesByDate(date);
    }

    @Override
    public void delFeeById(Long id) {
        feeRepository.deleteById(id);

    }

    @Override
    public Optional<Fee> findFeeById(Long id) {
        return feeRepository.findById(id);
    }

}
