package com.asociacion.services;

import com.asociacion.models.Config;
import java.util.List;
import java.util.Optional;

public interface ConfigService {

    public Config saveConfig(Config config);

    public Optional<Config> findById(Long id);

    public List<Config> getConfigs();

    List<Config> findConfigByOption(String configOption);

}
