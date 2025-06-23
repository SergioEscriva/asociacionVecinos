    package com.asociacion.backup;

    import org.springframework.stereotype.Component;
    import java.io.File;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;

    @Component
    public class BackupManager {


        private static final String BACKUP_FILE_PATH = "./backup/backupSQL.sql"; // /app


        public void backupDatabase(String dbUser, String dbPassword, String dbDatabase, String dbHost, String dbPort) throws IOException, InterruptedException {
            
            File outputFile = new File(BACKUP_FILE_PATH);
            if (!outputFile.getParentFile().exists()) {
                Files.createDirectories(Paths.get(outputFile.getParent()));
            }
            if (!outputFile.exists()) {
                outputFile.createNewFile();
            }


            String[] command = {
                "mysqldump",
                "-h", dbHost,
                "-P", dbPort,
                "-u", dbUser,
                "-p" + dbPassword,
                dbDatabase
            };
         
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectOutput(outputFile);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            // Leer la salida de error
            try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                   
                }
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("mysqldump ejecutado con éxito. Backup guardado en: " + BACKUP_FILE_PATH);
            } else {
                System.err.println("Error ejecutando mysqldump. Código de salida: " + exitCode);
                
                throw new RuntimeException("Error en mysqldump. Código de salida: " + exitCode);
            }
        }

        public String getBackupFilePath() {
            return BACKUP_FILE_PATH;
        }
    }
    