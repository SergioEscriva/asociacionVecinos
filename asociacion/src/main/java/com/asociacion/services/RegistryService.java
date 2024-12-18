package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import com.asociacion.models.Registry;

public interface RegistryService {

    Registry saveRegistry(Registry registry);

    List<Registry> findByMemberId(Long id);

    List<Registry> getRegistrys();

    List<Registry> getRegistriesOrderByMemberId();

    void delRegistryById(Long id);

    Optional<Registry> findRegistryById(Long id);

}
