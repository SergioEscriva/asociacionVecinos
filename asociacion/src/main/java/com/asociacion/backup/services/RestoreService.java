package com.asociacion.backup.services;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Service;

@Service
public class RestoreService {

    public void restoreDatabase(String backupFilePath) throws IOException, InterruptedException {
        //TODO extraer estos datos a lugar seguro
        String dbUsername = "root";
        String dbPassword = "000000";
        String dbName = "asociacion";

        ProcessBuilder pb = new ProcessBuilder(
            "mysql",
            "--user=" + dbUsername,
            "--password=" + dbPassword,
            "--host=localhost",
            "--port=3306",
            dbName
        );
        pb.redirectInput(new File(backupFilePath));
        pb.redirectError(ProcessBuilder.Redirect.INHERIT);

        Process process = pb.start();
        int exitCode = process.waitFor();
        if (exitCode == 0) {
            System.out.println("Restauración completada con éxito");
        } else {
            System.err.println("Error en la restauración");
        }
    }
}

