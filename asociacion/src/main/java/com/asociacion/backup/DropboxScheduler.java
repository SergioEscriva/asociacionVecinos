package com.asociacion.backup;

import java.io.File; // Importar File para usarlo en la redirección de mysqldump
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    private static final String BACKUP_FILE_PATH_IN_CONTAINER = "/app/backup/backupSQL.sql";


    public DropboxScheduler(ConfigServiceImp configServiceImp, DropboxUploader dropboxUploader, BackupManager backupManager) {
        this.configServiceImp = configServiceImp;
        this.dropboxUploader = dropboxUploader;
        this.backupManager = backupManager;
    }

    // Programación: 5 minutos después del inicio, luego cada hora.
    @Scheduled(initialDelay = 300000, fixedRate = 3600000)
    public void scheduleDropboxBackup() {
        System.out.println("Iniciando tarea programada de backup (local y Dropbox)...");
        try {
            String dbUser = System.getenv("DB_USER");
            String dbPassword = System.getenv("DB_PASSWORD");
            String dbDatabase = System.getenv("DB_DATABASE");
            String dbHost = "db";  
            String dbPort = "3306"; 

            // PRIMERO: Realizar el backup local de la base de datos.
            // Esta operación es independiente de si el token de Dropbox es válido.
            backupManager.backupDatabase(dbUser, dbPassword, dbDatabase, dbHost, dbPort);
            String localFilePath = backupManager.getBackupFilePath();
            
            // SEGUNDO: Intentar subir el archivo a Dropbox SOLO SI hay un token válido.
            Optional<Config> dropboxPathConfig = configServiceImp.findById(6L);
            Optional<Config> dropboxTokenConfig = configServiceImp.findById(5L);

            String dropboxPathString = dropboxPathConfig.isPresent() ? dropboxPathConfig.get().getConfigOption() : null;
            String dropboxTokenString = dropboxTokenConfig.isPresent() ? dropboxTokenConfig.get().getConfigOption() : null;

            System.out.println("Configuración de Dropbox recuperada:");
            System.out.println("  Ruta (Path): " + (dropboxPathString != null && !dropboxPathString.isEmpty() ? dropboxPathString.substring(0, Math.min(dropboxPathString.length(), 10)) + "..." : "[Vacío o Nulo]"));
            System.out.println("  Token (primeros 10 caracteres): " + (dropboxTokenString != null && !dropboxTokenString.isEmpty() ? dropboxTokenString.substring(0, Math.min(dropboxTokenString.length(), 10)) + "..." : "[Vacío o Nulo]"));

      
            if (dropboxPathString != null && !dropboxPathString.isEmpty() &&
                dropboxTokenString != null && !dropboxTokenString.isEmpty()) { 

                String dropboxUploadPath = dropboxPathString + System.currentTimeMillis() + "_backup.sql";
                dropboxUploader.uploadFile(localFilePath, dropboxUploadPath, dropboxTokenString);
                
                System.out.println("Backup de Dropbox subido con éxito a: " + dropboxUploadPath);

            } else {
                System.out.println("No se encontraron configuraciones de Dropbox (path o token) válidas o el token es el valor por defecto. No se realizará la subida a Dropbox.");
            }
        } catch (Exception e) {
            System.err.println("Error durante la tarea programada de backup: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
