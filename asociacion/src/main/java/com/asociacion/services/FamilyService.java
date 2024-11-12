package com.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Family;
import com.asociacion.repositories.FamilyRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FamilyService {

    @Autowired
    private FamilyRepository familyRepository;

    public Family saveFamily(Family family) {
        return familyRepository.save(family);
    }

    public Optional<Family> findById(Long id) {
        return familyRepository.findById(id);
    }

    public List<Family> getFamilys() {
       
        return familyRepository.findAll();
    }

    public void delFamilyById(Long id) {
        familyRepository.deleteById(id);

    }

}






