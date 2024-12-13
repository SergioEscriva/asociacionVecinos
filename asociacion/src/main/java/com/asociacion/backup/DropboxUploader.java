package com.asociacion.backup;

import java.io.FileInputStream;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;
import com.dropbox.core.v2.files.WriteMode;

@Component
public class DropboxUploader {

    @Autowired
    private DropboxFileManager dropboxFileManager;

    
    public DropboxUploader(DropboxFileManager dropboxFileManager) {
        this.dropboxFileManager = dropboxFileManager;
    }

    public void uploadFile(String localFilePath, String dropboxPath, String accessToken) {
        DbxRequestConfig config = DbxRequestConfig.newBuilder("dropbox/java-tutorial").build();
        DbxClientV2 client = new DbxClientV2(config, accessToken);

        try (InputStream in = new FileInputStream(localFilePath)) {
            FileMetadata metadata = client.files().uploadBuilder(dropboxPath)
                    .withMode(WriteMode.OVERWRITE)
                    .uploadAndFinish(in);
            System.out.println("Archivo subido: " + metadata.getPathLower());
            
            // Reorganizar los archivos.
            dropboxFileManager.manageFiles(client);
        } catch (Exception e) {
            System.err.println("Error subiendo archivo a Dropbox");
            e.printStackTrace();
        }
    }
}
