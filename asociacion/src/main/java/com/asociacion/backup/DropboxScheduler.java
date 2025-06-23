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
    private ConfigServiceImp configServiceImp;

    @Autowired
    private DropboxUploader dropboxUploader;

    @Autowired
    private BackupManager backupManager;

    @Autowired
    private DropboxTokenService dropboxTokenService;


    private static final String BACKUP_FILE_PATH_IN_CONTAINER = "/app/backup/backupSQL.sql";


    public DropboxScheduler(ConfigServiceImp configServiceImp, DropboxUploader dropboxUploader, BackupManager backupManager) {
        this.configServiceImp = configServiceImp;
        this.dropboxUploader = dropboxUploader;
        this.backupManager = backupManager;
    }

    // Programación: 5 (300000)minutos después del inicio, luego cada hora.
   @Scheduled(initialDelay = 100, fixedRate = 3600000)
public void scheduleDropboxBackup() {
    String dbUser = System.getenv("DB_USER");
    String dbPassword = System.getenv("DB_PASSWORD");
    String dbDatabase = System.getenv("DB_DATABASE");
    String dbHost = "localhost";
    String dbPort = "3306";
    Optional<Config> appKey = configServiceImp.findById(10L);
    Optional<Config> appSecret = configServiceImp.findById(11L);
    Optional<Config> refreshToken = configServiceImp.findById(12L);

    if (dbUser != null && dbPassword != null && dbDatabase != null  && appKey.isPresent() && appSecret.isPresent() && refreshToken.isPresent()) {
        try {
            // Paso 1: generar el backup local
            backupManager.backupDatabase(
                dbUser,
                dbPassword,
                dbDatabase,
                dbHost,
                dbPort
            );

            String localFilePath = backupManager.getBackupFilePath(); // /app/backup/backupSQL.sql
            Optional<Config> dropboxPathConfig = configServiceImp.findById(6L);
            String dropboxPathString = dropboxPathConfig.isPresent() ? dropboxPathConfig.get().getAttribute() : null;
            System.out.println("Ruta de Dropbox: " + dropboxPathString);
            // Paso 2: obtener token actualizado con refresh token
            String accessToken = dropboxTokenService.getAccessTokenFromRefresh(
                refreshToken.get().getAttribute(),
                appKey.get().getAttribute(),
                appSecret.get().getAttribute()
            );

            // Paso 3: subir a Dropbox dropboxPathString
            String dropboxPath = dropboxPathString + System.currentTimeMillis() + "_backup.sql";
            dropboxUploader.uploadFile(localFilePath, dropboxPath, accessToken);

        } catch (Exception e) {
            System.err.println("Error en el proceso de backup y subida a Dropbox: " + e.getMessage());
            e.printStackTrace();
        }
    } else {
        System.err.println("Faltan parámetros en la base de datos Config.");
    }
}

}
