package com.asociacion.backup.controllers;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.asociacion.backup.services.RestoreService;

@RestController
@RequestMapping("/api/database")
public class RestoreController {
    @Autowired
    private RestoreService restoreService;

    @PostMapping("/restore")
    public ResponseEntity<String> restoreDatabase(MultipartFile backupFile) {
        try {
    
            File tempFile = File.createTempFile("backup", ".sql");
            backupFile.transferTo(tempFile);
            restoreService.restoreDatabase(tempFile.getAbsolutePath());
            tempFile.delete();

            return ResponseEntity.ok("Restauración iniciada");
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en la restauración");
        }
    }
}


