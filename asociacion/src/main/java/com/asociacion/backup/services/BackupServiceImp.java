package com.asociacion.backup.services;

import java.io.IOException;

import org.springframework.stereotype.Service;

import com.asociacion.backup.BackupManager;

@Service
public class BackupServiceImp {

   
    public static void performBackup(){
    try {
        boolean success = BackupManager.backupDatabase();
        if (success) {
            System.out.println("Backup realizado con éxito");
        } else {
            System.err.println("Error al realizar el backup");
        }
    } catch (IOException | InterruptedException e) {
        e.printStackTrace();
    }
}
}
    

