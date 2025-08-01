package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.asociacion.models.Registry;

import com.asociacion.services.RegistryServiceImp;

@RestController
@RequestMapping("/api/registry")
public class RegistryController {

    @Autowired
    private RegistryServiceImp registryService;
    


    //@GetMapping()
    //public List<Registry> getRegistries(){
    //    return registryService.getRegistriesOrderByMemberId();
    //}

    @GetMapping()
    public List<Registry> getAllRegistries(){
        return registryService.getRegistriesOrderByMemberId();
    }

    @GetMapping("/{id}")
    public Optional<Registry> getRegistryById(@PathVariable Long id) {
        return registryService.findRegistryById(id);
    }

    @GetMapping("/member/{id}")
    public List<Registry> getRegistryByMemberId(@PathVariable Long id) {
        return registryService.findByMemberId(id);
    }

    @PostMapping
    public ResponseEntity<Registry> createRegistry(@RequestBody Registry registry) {
        Registry savedRegistry = registryService.saveRegistry(registry);

        return new ResponseEntity<>(savedRegistry, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Registry> updateRegistry(@PathVariable Long id, @RequestBody Registry registry) {
        Optional<Registry> existingRegistry = registryService.findRegistryById(id);

        if (existingRegistry.isPresent()) {
            registry.setId(id);
            
            Registry updatedRegistry = registryService.saveRegistry(registry);
            return new ResponseEntity<>(updatedRegistry, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}