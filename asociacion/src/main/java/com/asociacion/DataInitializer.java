package com.asociacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.asociacion.models.Config;
import com.asociacion.repositories.ConfigRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ConfigRepository configRepository;

    @Override
    public void run(String... args) throws Exception {
        if (configRepository.count() == 0) {
            configRepository.save(new Config("Nombre Organización", true, "Agrupación Vecinal"));
            configRepository.save(new Config("Número Socio Inicial", true, "0"));
            configRepository.save(new Config("Atributo Socio", true, "Socio/a"));
            configRepository.save(new Config("Año/s impago para Inactivo", true, "1"));
            configRepository.save(new Config("Token Dropbox Backup", true, "tu_token"));
            configRepository.save(new Config("Directorio en Dropbox Backup", true, "/Aplicaciones/Asociacion/"));
        } else {
        }
    }
}
