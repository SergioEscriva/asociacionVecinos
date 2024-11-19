package com.asociacion.services;

import java.util.List;

import com.asociacion.models.Fee;

public interface FeeService {

    public Fee saveFee(Fee fee);

    public List<Fee> findByMemberId(Long id);

    public List<Fee> getFees();

    public void delFeeById(Long id);

}
