package com.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Config;
import com.asociacion.repositories.ConfigRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ConfigServiceImp implements ConfigService {

    @Autowired
    private ConfigRepository configRepository;

    public Config saveConfig(Config config) {
        return configRepository.save(config);
    }

    public Optional<Config> findById(Long id) {
        return configRepository.findById(id);
    }

    public List<Config> getConfigs() {

        return configRepository.findAll();
    }

    @Override
    public List<Config> findConfigByOption(String option) {
        return configRepository.findConfigByOption(option);
    }

}
