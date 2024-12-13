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
@Table(name = "configs")
public class Config {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String configOption;
    private Boolean active;

    @Column(columnDefinition = "TEXT")
    private String attribute;

    public Config() {
    }

    public Config(String configOption, boolean active, String attribute) {
        this.configOption = configOption;
        this.active = active;
        this.attribute = attribute;
    }
}
