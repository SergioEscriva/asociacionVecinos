package com.asociacion.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.asociacion.repositories.MemberRepository;

@Service
public class MemberNumberService {

    @Autowired
    private MemberRepository memberRepository;

    private Long lastGeneratedNumber = 10000L;

    @PostConstruct
    public void initialize() {
        Long maxNumber = memberRepository.findMaxMemberNumberAbove(10000L);
        if (maxNumber != null && maxNumber >= 10000) {
            lastGeneratedNumber = maxNumber;
        }
    }

    @Transactional
    public synchronized Long generateNextMemberNumber() {
        return ++lastGeneratedNumber;
    }
}

