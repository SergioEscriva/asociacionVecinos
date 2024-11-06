package com.asociacion.asociacion.model;

import org.springframework.boot.autoconfigure.domain.EntityScan;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

//Pojo class
@Data
@EntityScan
@Table(name = "socios")
public class Socio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long numberSocio;
    private Long numberFamily;
    private String name;
    private String lastName1;
    private String lastName2;
    private String address;
    private Long addressNumber;
    private Long addressDoor;
    private String addressStaircase;
    private String location;
    private Long phone;
    private Long dni;
    private String gender;
    private Boolean active;


}
