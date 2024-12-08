package com.asociacion.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import com.asociacion.models.Config;
import com.asociacion.repositories.ConfigRepository;
import com.asociacion.repositories.MemberRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
@DependsOn("dataInitializer")
public class MemberNumberServiceImp implements MemberNumberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ConfigServiceImp configServiceImp;

    @Autowired
    private ConfigRepository configRepository;

    private Long numberStart;
    private Long lastGeneratedNumber;

    @PostConstruct
    public void initialize() {

        Optional<Config> optionalConfig = configServiceImp.findById(2L);

        if (configRepository.findById(2L).isPresent()) {
            try {
                numberStart = Long.parseLong(optionalConfig.get().getAttribute());
            } catch (NumberFormatException e) {
                throw new IllegalStateException("El atributo de configuración no es un número válido.", e);
            }
        } else {
            numberStart = 0L;
        }

        Long maxNumber = memberRepository.findMaxMemberNumberAbove(numberStart);
        if (maxNumber != null && maxNumber >= numberStart) {
            lastGeneratedNumber = maxNumber;
        } else {
            lastGeneratedNumber = numberStart;
        }
    }

    @Transactional
    public synchronized Long generateNextMemberNumber() {
        return ++lastGeneratedNumber;
    }
}
