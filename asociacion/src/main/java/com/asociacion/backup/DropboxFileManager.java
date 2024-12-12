package com.asociacion.backup;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.asociacion.models.Config;
import com.asociacion.services.ConfigServiceImp;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.Metadata;

@Component
public class DropboxFileManager {

    @Autowired
    private ConfigServiceImp configServiceImp;
    
    public DropboxFileManager(ConfigServiceImp configServiceImp) {
        this.configServiceImp = configServiceImp;
    }

    public void manageFiles(DbxClientV2 client) {
        try {
            Optional<Config> dropboxPathConfig = configServiceImp.findById(6L);

            if (!dropboxPathConfig.isPresent()) {
                throw new RuntimeException("No se encontró la configuración de Dropbox");
            }
            String dropboxPathString = dropboxPathConfig.get().getAttribute();

            List<Metadata> files = client.files().listFolder(dropboxPathString).getEntries();

            // Archiva por mes y año
            Map<String, List<Metadata>> filesByMonthYear = new HashMap<>();
            for (Metadata file : files) {
                String fileName = file.getName();

                try {
                    long timestamp = Long.parseLong(fileName.split("_")[0]);
                    LocalDate fileDate = LocalDate.ofEpochDay(timestamp / (24 * 60 * 60 * 1000));
                    String key = fileDate.getYear() + "-" + fileDate.getMonthValue();
                    filesByMonthYear.computeIfAbsent(key, k -> new ArrayList<>()).add(file);
                } catch (Exception e) {
                    System.err.println("No se pudo parsear la fecha del archivo: " + fileName);
                    e.printStackTrace();
                }
            }

            LocalDate now = LocalDate.now();
            String currentMonthYear = now.getYear() + "-" + now.getMonthValue();
            for (Map.Entry<String, List<Metadata>> entry : filesByMonthYear.entrySet()) {
                String monthYear = entry.getKey();
                List<Metadata> monthFiles = entry.getValue();

                // Mantener solo 3 archivos del mes en curso
                if (monthYear.equals(currentMonthYear) && monthFiles.size() > 3) {
                    // Orden descendente
                    monthFiles.sort((f1, f2) -> f2.getName().compareTo(f1.getName()));
                    for (int i = 3; i < monthFiles.size(); i++) {
                        client.files().deleteV2(monthFiles.get(i).getPathLower());
                        //System.out.println("Archivo eliminado: " + monthFiles.get(i).getPathLower());
                    }
                }

                // Mantener el último archivo de cada mes
                if (!monthYear.equals(currentMonthYear)) {
                    // Orden descendente
                    monthFiles.sort((f1, f2) -> f2.getName().compareTo(f1.getName()));
                    for (int i = 0; i < monthFiles.size() - 1; i++) {
                        client.files().deleteV2(monthFiles.get(i).getPathLower());
                        System.out.println("Archivo eliminado: " + monthFiles.get(i).getPathLower());
                    }
                }

                // Reemplazar el archivo del mes del año anterior con el nuevo archivo del mes actual
                if (Integer.parseInt(monthYear.split("-")[0]) == now.getYear() - 1) {
                    for (Metadata file : monthFiles) {
                        client.files().deleteV2(file.getPathLower());
                        System.out.println("Archivo del año anterior eliminado: " + file.getPathLower());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error en manageFiles");
            e.printStackTrace();
        }
    }
}
