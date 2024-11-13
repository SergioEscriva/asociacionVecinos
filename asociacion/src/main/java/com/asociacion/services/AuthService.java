package com.asociacion.services;


import com.asociacion.models.Admin;

public interface AuthService {

    Admin login(String email, String password);

    void register(Admin admin);
}
