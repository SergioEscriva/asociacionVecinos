package com.asociacion.services;

import com.asociacion.models.Fee;
import java.util.List;
import java.util.Optional;

public interface FeeService {

    public Fee saveFee(Fee fee);

    public Optional<Fee> findById(Long id);

    public List<Fee> getFees();

    public void delFeeById(Long id);

}
