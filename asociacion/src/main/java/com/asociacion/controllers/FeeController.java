package com.asociacion.controllers;

import java.time.LocalDate;
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

import com.asociacion.models.Config;
import com.asociacion.models.Fee;
import com.asociacion.models.Member;
import com.asociacion.services.ConfigServiceImp;
import com.asociacion.services.FeeServiceImp;
import com.asociacion.services.MemberServiceImp;

@RestController
@RequestMapping("/api/fee")
public class FeeController {

    @Autowired
    private FeeServiceImp feeService;

    @Autowired
    private ConfigServiceImp configService;

    @Autowired
    private MemberServiceImp memberService;


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

     @GetMapping("/member/FeesByDate/{startDate}/{endDate}")
    public List<Fee> getFeesByDate(@PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        return feeService.findFeesByDate(startDate, endDate);
    }



    @PostMapping
    public ResponseEntity<Fee> createFee(@RequestBody Fee fee) {
        Fee savedFee = feeService.saveFee(fee);
        this.checkInactiveNotFee(savedFee.getId());
        return new ResponseEntity<>(savedFee, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public void delFeeById(@PathVariable Long id) {
        this.checkInactiveNotFee(id);
        feeService.delFeeById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        this.checkInactiveNotFee(fee.getId());
        return new ResponseEntity<>(feeService.saveFee(fee), HttpStatus.OK);
    }


    public void inactiveNotFee() {
        List<Member> members = memberService.getMembers();
        for (Member member : members) {
            List<Fee> feesMember = feeService.findByMemberId(member.getId());
            for (Fee fee : feesMember) {
                checkInactiveNotFee(fee.getId());
            }
        }
    }

    public void checkInactiveNotFee(Long feeId) {
        int actualYear = LocalDate.now().getYear();
        Optional<Config> configYearsForInactive = configService.findById(4L);
        if (configYearsForInactive.isPresent()) {
            int yearsForInactiveInt = Integer.parseInt(configYearsForInactive.get().getAttribute());
            int yearsForInactive = actualYear - yearsForInactiveInt;
            Optional<Fee> fee = feeService.findFeeById(feeId);
            Optional<Member> member = memberService.findById(fee.get().getMemberId());

            if (fee.get().getYear() >= yearsForInactive) {
                member.get().setActive(true);
            } else {
                member.get().setActive(false);
            }

            memberService.saveMember(member.get());
        } else {
            throw new IllegalStateException("No se encontró la configuración con ID 4L.");
        }
    }



}
