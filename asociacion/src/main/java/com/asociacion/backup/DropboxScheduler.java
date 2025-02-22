package com.asociacion.backup;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.asociacion.models.Config;
import com.asociacion.services.ConfigServiceImp;

@Component
public class DropboxScheduler {

    @Autowired
    private  ConfigServiceImp configServiceImp;

    @Autowired
    private  DropboxUploader dropboxUploader;

    
    public DropboxScheduler(ConfigServiceImp configServiceImp, DropboxUploader dropboxUploader) {
        this.configServiceImp = configServiceImp;
        this.dropboxUploader = dropboxUploader;
    }

    @Scheduled(fixedRate = 1800000) // 60000 ms = 1 minuto, 1800000 30min
    public void scheduleDropboxBackup() {
        Optional<Config> dropboxPathConfig = configServiceImp.findById(6L);
        Optional<Config> dropboxTokenConfig = configServiceImp.findById(5L);
        String dropboxPathString = dropboxPathConfig.get().getAttribute();
        String dropboxTokenString = dropboxTokenConfig.get().getAttribute();
        
        if (!dropboxPathString.equals("") && !dropboxTokenString.equals("")) {
            
            String localFilePath = "./backup/backupSQL.sql";
            String dropboxPath = dropboxPathString + System.currentTimeMillis() + "_archivo.sql";
            dropboxUploader.uploadFile(localFilePath, dropboxPath, dropboxTokenString);
        } else {
            System.out.println("No se encontraron configuraciones de Dropbox.");
        }
    }
}
