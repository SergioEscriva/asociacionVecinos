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
        Long familyMasterNumber = family.getFamilyMasterNumber();
        boolean coulBeMaster = true;
        Family memberMaster = family;

        if (familyMasterNumber > 0) {
            Optional<Family> memberMasterOpt = getFamilyByMemberNumber(familyMasterNumber);
            memberMaster = new Family();
            memberMaster = memberMasterOpt.get();
            coulBeMaster = memberCouldBeMaster(family);
        }

        // Si puede ser Master de la Familia y tiene un 0 como familyNumber, se añade su
        // Master.
        // Si no, se añade un 0 como que no se puede.
        if (coulBeMaster) {
            if (memberMaster.getFamilyMasterNumber() == 0) {
                memberMaster.setFamilyMasterNumber(familyMasterNumber);
            } else {
                familyRepository.save(memberMaster);
            }
        } else {
            family.setFamilyMasterNumber(0L);
        }
        Family familySave = familyRepository.save(family);

        // Comprueba si se ha modificado el Master y no tiene Familia, que se ponga a 0
        memberMasterNotMaster();
        return familySave;
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

    public int searchAllFamilyMaster(Long familyMasterNumber) {
        return familyRepository.findAllByFamilyMasterNumber(familyMasterNumber).size();
    }

    public void memberMasterNotMaster() {
        /// Long familyMasterNumber = family.getFamilyMasterNumber();
        // Optional<Family> familyMasterOpt =
        /// getFamilyByMemberNumber(familyMasterNumber);
        // Family familyMaster = familyMasterOpt.get();
        // int allFamilies = searchAllFamilyMaster(familyMasterNumber);

        /*
         * System.out.print(familyMasterNumber + " AAAAAAAAAAA " + allFamilies);
         * 
         * Long familyNumberMaster = familyMaster.getFamilyMasterNumber();
         * Long memberNumberMaster = familyMaster.getMemberNumber();
         */

        List<Family> families = familyRepository.findAll();

        for (Family family : families) {
            Long familyNumber = family.getFamilyMasterNumber();
            int sizeFamilyMaster = searchAllFamilyMaster(familyNumber);
            System.out.println(sizeFamilyMaster);
            if (sizeFamilyMaster == 1) {
                family.setFamilyMasterNumber(0L);
                familyRepository.save(family);
            }

        }

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
