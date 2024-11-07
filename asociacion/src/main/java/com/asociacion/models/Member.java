package com.asociacion.models;

import java.util.Objects;

import org.springframework.boot.autoconfigure.domain.EntityScan;

import com.asociacion.services.MemberService;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

//Pojo class
@Data
@EntityScan
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private Long memberNumber;

    private Long IdFamily;
    private String name;
    private String lastName1;
    private String lastName2;
    private String address;
    private Long addressNumber;
    private Long addressDoor;
    private String addressStaircase;
    private String location;
    private Long phone;
    private String email;
    private Long dni;
    private String gender;
    private Boolean active;

}

