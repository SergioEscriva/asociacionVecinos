package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.asociacion.models.Config;
import com.asociacion.services.ConfigService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/configs")
public class ConfigController {

    @Autowired
    private ConfigService configService;

    @GetMapping()
    public List<Config> getConfigs() {
        return configService.getConfigs();
    }

    @GetMapping("/{id}")
    public Optional<Config> getConfigById(@PathVariable Long id) {
        return configService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Config> createConfig(@RequestBody Config config) {
        Config savedConfig = configService.saveConfig(config);
        return new ResponseEntity<>(savedConfig, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Config> updateConfig(@PathVariable Long id, @RequestBody Config config) {
        Optional<Config> existingConfig = configService.findById(id);
        if (existingConfig.isPresent()) {
            config.setId(id);
            Config updatedConfig = configService.saveConfig(config);
            return new ResponseEntity<>(updatedConfig, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
