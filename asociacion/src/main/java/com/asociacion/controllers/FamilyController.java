package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.asociacion.models.Family;
import com.asociacion.services.FamilyService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/family")
public class FamilyController {

    @Autowired
    private FamilyService familyService;

    @GetMapping()
    public List<Family> getFamilys() {
        return familyService.getFamilys();
    }

    @GetMapping("/{id}")
    public Optional<Family> getFamilyById(@PathVariable Long id) {
        return familyService.findById(id);
    }

    @GetMapping("/member/{memberId}")
    public Optional<Family> getFamilyByMemberNumber(@PathVariable Long memberNumber) {
        return familyService.getFamilyByMemberNumber(memberNumber);
    }

    @GetMapping("/exist/{familyMasterNumber}")
    public boolean getCheckFamilyMemberId(@PathVariable Long familyMasterNumber) {
        return familyService.searchInTable(familyMasterNumber);
    }

    @DeleteMapping("/{id}")
    public void delFamilyById(@PathVariable Long id) {
        familyService.delFamilyById(id);
    }

    @PostMapping
    public ResponseEntity<Family> createFamily(@RequestBody Family family) {
        Family savedFamily = familyService.saveFamily(family);
        return new ResponseEntity<>(savedFamily, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Family> updateFamily(@PathVariable Long id, @RequestBody Family family) {
        Optional<Family> existingFamily = familyService.findById(id);
        if (existingFamily.isPresent()) {
            family.setId(id);
            Family updatedFamily = familyService.saveFamily(family);
            return new ResponseEntity<>(updatedFamily, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
