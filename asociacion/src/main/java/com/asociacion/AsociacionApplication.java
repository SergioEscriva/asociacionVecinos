package com.asociacion;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import com.asociacion.backup.BackupServiceImp;



@SpringBootApplication
@EnableAspectJAutoProxy
public class AsociacionApplication {

	public static void main(String[] args) {
		SpringApplication.run(AsociacionApplication.class, args);

		        // Programar la consolidación de backups cada hora
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
				BackupServiceImp.performBackup();
        }, 0, 1, TimeUnit.HOURS); // Ejecuta inmediatamente y luego cada hora
	}

}
