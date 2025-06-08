package com.asociacion.services;

import com.asociacion.models.Admin;
import com.asociacion.repositories.AdminRepository;
import com.google.common.hash.Hashing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;


@Service
public class AuthServiceImp implements AuthService{

    @Autowired
    private AdminRepository adminRepository;


    @Override
    public Admin login(String user, String password) {
        String hashPassword = Hashing.sha256()
                .hashString(password + System.getenv("PALABRA_SECRETA"), StandardCharsets.UTF_8)
                .toString();

        List<Admin> result = adminRepository.findByUserAndPassword(user,hashPassword);
        if(result.isEmpty()){
            return null;
            //no encontró nada
        }else{
            return result.get(0);
            //encontró el usuario
        }
    }

    @Override
    public void register(Admin admin) {
        String hashPassword = Hashing.sha256()
                .hashString(admin.getPassword() + System.getenv("PALABRA_SECRETA"), StandardCharsets.UTF_8)
                .toString();

        admin.setPassword(hashPassword);
        adminRepository.save(admin);
    }
}
