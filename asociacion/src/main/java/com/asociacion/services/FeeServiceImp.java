package com.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Fee;
import com.asociacion.repositories.FeeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FeeServiceImp implements FeeService {

    @Autowired
    private FeeRepository feeRepository;

    public Fee saveFee(Fee fee) {
        return feeRepository.save(fee);
    }

    public Optional<Fee> findById(Long id) {
        return feeRepository.findById(id);
    }

    public List<Fee> getFees() {

        return feeRepository.findAll();
    }

    public void delFeeById(Long id) {
        feeRepository.deleteById(id);

    }

}
