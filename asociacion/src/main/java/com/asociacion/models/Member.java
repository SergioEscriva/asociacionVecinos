package com.asociacion.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.Data;

//Pojo class
@Data
@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long memberNumber;
    private String name;
    private String lastName1;
    private String lastName2;
    private String address;
    private String addressNumber;
    private String addressDoor;
    private String addressStaircase;
    private String location;
    private Long phone;
    private String email;
    private String dni;
    private String gender;
    private Boolean active;
    private String notes;

}
