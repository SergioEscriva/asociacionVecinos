package com.asociacion.backup;

import java.io.File;
import java.io.IOException;

public class BackupManager {
    public static boolean backupDatabase() throws IOException, InterruptedException {
        //TODO extraer estos datos a lugar seguro
        String dbUsername = "root";
        String dbPassword = System.getenv("DB_PASSWORD");
        String dbName = "asociacion";
        String outputFile = "asociacion/backup/backupSQL.sql";
        
        ProcessBuilder pb = new ProcessBuilder(
            "mysqldump",
            "--user=" + dbUsername,
            "--password=" + dbPassword,
            "--host=localhost",
            "--port=3306",
            "--add-drop-table",
            "--databases",
            dbName
        );
        pb.redirectOutput(new File(outputFile));
        pb.redirectError(ProcessBuilder.Redirect.INHERIT);

        Process process = pb.start();
        int exitCode = process.waitFor();
        return exitCode == 0;


    }
}
