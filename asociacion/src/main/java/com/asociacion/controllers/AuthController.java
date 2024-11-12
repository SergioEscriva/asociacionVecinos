package com.asociacion.controllers;

import com.asociacion.Utils.JwtUtil;
import com.asociacion.dto.RequestLogin;
import com.asociacion.models.Admin;
import com.asociacion.services.AdminService;
import com.asociacion.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private AdminService adminService;


    @PostMapping("/auth/login")
    public String login(@RequestBody RequestLogin request){
        String user = request.getUser();
        String password = request.getPassword();
        Admin admin = service.login(user,password);
        return JwtUtil.generateToken(admin);
    }

    @PostMapping("/auth/register")
    public void registerUsuario(@RequestBody Admin admin){
        service.register(admin);
    }

    @GetMapping("/auth/existeUsuario")
    public Boolean existe(@RequestHeader String Authorization){
        String id = JwtUtil.getUserIdByToken(Authorization);
        Admin admin = adminService.getAdmin(Integer.valueOf(id));
        return admin != null;
    }



}

