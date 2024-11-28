package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Registry;
import com.asociacion.repositories.RegistryRepository;

@Service
public class RegistryServiceImp implements RegistryService {

    @Autowired
    private RegistryRepository registryRepository;

    @Override
    public Registry saveRegistry(Registry registry) {
        return registryRepository.save(registry);
    }

    @Override
    public List<Registry> findByMemberId(Long memberId) {
        return registryRepository.findByMemberId(memberId);
    }

    @Override
    public List<Registry> getRegistrys() {

        return registryRepository.findAll();
    }

    @Override
    public void delRegistryById(Long id) {
        registryRepository.deleteById(id);
    }

    @Override
    public Optional<Registry> findRegistryById(Long id) {
        return registryRepository.findById(id);
    }

}
