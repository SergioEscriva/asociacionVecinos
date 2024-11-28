package com.asociacion.models;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

//Pojo class
@Data
@Entity
@Table(name = "registries")
public class Registry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long memberId;
    private Date startData; // "2024-11-12"
    private Date endData;
    private String reasonEnd; // en código "Fallecido", "Personal" etc

}
