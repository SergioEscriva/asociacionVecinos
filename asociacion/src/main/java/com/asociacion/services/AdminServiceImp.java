package com.asociacion.services;

import com.asociacion.models.Admin;
import com.asociacion.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImp implements AdminService{

    @Autowired
    private AdminRepository repository;

    @Override
    public Admin getAdmin(Integer id) {
       Optional<Admin> admin = repository.findById(id);
       if(admin.isPresent()){
           return admin.get();
       }
        return null;
    }
}
