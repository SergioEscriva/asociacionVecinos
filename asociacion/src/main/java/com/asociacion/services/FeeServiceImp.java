package com.asociacion.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Fee;
import com.asociacion.repositories.FeeRepository;

@Service
public class FeeServiceImp implements FeeService {

    @Autowired
    private FeeRepository feeRepository;

    public Fee saveFee(Fee fee) {
        return feeRepository.save(fee);
    }

    public List<Fee> findByMemberId(Long memberId) {
        return feeRepository.findByMemberId(memberId);
    }

    public List<Fee> getFees() {

        return feeRepository.findAll();
    }

    public void delFeeById(Long id) {
        feeRepository.deleteById(id);

    }

}
