package com.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Family;
import com.asociacion.repositories.FamilyRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FamilyService {

    @Autowired
    private FamilyRepository familyRepository;

    public Family saveFamily(Family family) {

        System.out.println(family.getFamilyMasterNumber());

        Long familyMasterNumber = family.getFamilyMasterNumber();

        boolean coulBeMaster = true;
        Family memberMaster = family;
        if (familyMasterNumber > 0) {
            Optional<Family> memberMasterOpt = getFamilyByMemberNumber(familyMasterNumber);
            memberMaster = new Family();
            memberMaster = memberMasterOpt.get();
            coulBeMaster = memberCouldBeMaster(family);
        }

        if (coulBeMaster) {
            if (memberMaster.getFamilyMasterNumber() == 0) {
                memberMaster.setFamilyMasterNumber(familyMasterNumber);
            }
            familyRepository.save(memberMaster);
            return familyRepository.save(family);
        }
        family.setFamilyMasterNumber(0L);
        return familyRepository.save(family);
    }

    public Optional<Family> findById(Long id) {
        return familyRepository.findById(id);
    }

    public Optional<Family> getFamilyByMemberNumber(Long memberNumber) {
        return familyRepository.findByMemberNumber(memberNumber);
    }

    public List<Family> findByFamilyMasterNumber(Long familyMasterNumber) {
        List<Family> familys = familyRepository.findAll();
        List<Family> familysByFamilyNumber = new ArrayList<>();

        for (Family family : familys) {
            if (family.getFamilyMasterNumber().equals(familyMasterNumber)) {
                familysByFamilyNumber.add(family);
            }
        }
        return familysByFamilyNumber;
    }

    public List<Family> getFamilys() {

        return familyRepository.findAll();
    }

    public void delFamilyById(Long id) {
        familyRepository.deleteById(id);

    }

    public boolean searchInTable(Long familyMasterNumber) {
        return familyRepository.findByFamilyMasterNumber(familyMasterNumber).isPresent();
    }

    public boolean memberCouldBeMaster(Family family) {
        Long familyNumber = family.getFamilyMasterNumber();
        Optional<Family> familyMasterOpt = getFamilyByMemberNumber(familyNumber);
        Family familyMaster = familyMasterOpt.get();
        Long familyNumberMaster = familyMaster.getFamilyMasterNumber();
        Long memberNumberMaster = familyMaster.getMemberNumber();

        if (familyNumberMaster == 0 || familyNumberMaster.equals(memberNumberMaster)) {
            return true;
        }
        return false;
    }
}
