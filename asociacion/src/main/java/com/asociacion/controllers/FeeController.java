package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asociacion.Utils.Utils;
import com.asociacion.models.Fee;
import com.asociacion.services.FeeServiceImp;

@RestController
@RequestMapping("/api/fee")
public class FeeController {

    @Autowired
    private FeeServiceImp feeService;

    @Autowired
    Utils utils;

    @GetMapping()
    public List<Fee> getFees() {
        return feeService.getFees();
    }

    @GetMapping("/{id}")
    public Optional<Fee> getFeeById(@PathVariable Long id) {
        return feeService.findFeeById(id);
    }

    @GetMapping("/member/{id}")
    public List<Fee> getFeeByMemberId(@PathVariable Long id) {
        return feeService.findByMemberId(id);
    }

    @GetMapping("/member/lastFee/{id}")
    public List<Fee> findLastFeeByMemberId(@PathVariable Long id) {
        return feeService.findLastFeeByMemberId(id);
    }

    @PostMapping
    public ResponseEntity<Fee> createFee(@RequestBody Fee fee) {
        Fee savedFee = feeService.saveFee(fee);
        utils.checkInactiveNotFee(savedFee.getId());
        return new ResponseEntity<>(savedFee, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public void delFeeById(@PathVariable Long id) {
        utils.checkInactiveNotFee(id);
        feeService.delFeeById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        utils.checkInactiveNotFee(fee.getId());
        return null;
    }

}
