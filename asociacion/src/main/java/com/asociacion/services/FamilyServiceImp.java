package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Family;
import com.asociacion.repositories.FamilyRepository;

@Service
public class FamilyServiceImp implements FamilyService {

    @Autowired
    private FamilyRepository familyRepository;

    // @Autowired
    // private MemberRepository memberRepository;

    public Family saveFamily(Family family) {
        Long familyMasterNumber = family.getFamilyMasterNumber();
        boolean coulBeMaster = true;
        Family memberMaster = family;

        if (familyMasterNumber > 0) {
            Optional<Family> memberMasterOpt = findByMemberNumber(familyMasterNumber);
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

    public List<Family> findByFamilyMasterNumber(Long familyMasterNumber) {
        // List<Family> familys = familyRepository.findAll();
        // List<Family> familysByFamilyNumber = new ArrayList<>();

        // for (Family family : familys) {
        // if (family.getFamilyMasterNumber().equals(familyMasterNumber)) {
        // familysByFamilyNumber.add(family);
        // }
        // }
        // return familysByFamilyNumber;

        return familyRepository.findAllByFamilyMasterNumber(familyMasterNumber);
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

    public Optional<Family> findByMemberNumber(Long masterNumber) {
        return familyRepository.findByMemberNumber(masterNumber);
    }

    public void memberMasterNotMaster() {
        List<Family> families = familyRepository.findAll();

        for (Family family : families) {
            Long familyNumber = family.getFamilyMasterNumber();
            int sizeFamilyMaster = searchAllFamilyMaster(familyNumber);

            if (sizeFamilyMaster == 1) {
                family.setFamilyMasterNumber(0L);
                familyRepository.save(family);
            } else if (sizeFamilyMaster >= 2) {
                family.setFamilyMasterNumber(familyNumber);
                familyRepository.save(family);

            }
        }

    }

    // Para ser master debe ser 0, o coincidir el familyNumber y memberNumber
    public boolean memberCouldBeMaster(Family family) {
        Long familyNumber = family.getFamilyMasterNumber();
        Optional<Family> familyMasterOpt = findByMemberNumber(familyNumber);
        Family memberMaster = familyMasterOpt.get();
        Long familyNumberMaster = memberMaster.getFamilyMasterNumber();
        Long memberNumberMaster = memberMaster.getMemberNumber();

        if (familyNumberMaster == 0 || familyNumberMaster.equals(memberNumberMaster)) {
            return true;
        }
        return false;
    }
}
