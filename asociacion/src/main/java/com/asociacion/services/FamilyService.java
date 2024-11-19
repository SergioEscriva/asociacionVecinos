package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import com.asociacion.models.Family;

public interface FamilyService {

    public Family saveFamily(Family family);

    public Optional<Family> findById(Long id);

    public Optional<Family> findByMemberNumber(Long memberNumber);

    public List<Family> findByFamilyMasterNumber(Long familyMasterNumber);

    public List<Family> getFamilys();

    public void delFamilyById(Long id);

    public boolean searchInTable(Long familyMasterNumber);

    public int searchAllFamilyMaster(Long familyMasterNumber);

    public void memberMasterNotMaster();

    public boolean memberCouldBeMaster(Family family);
}
