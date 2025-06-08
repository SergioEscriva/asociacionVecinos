package com.asociacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Habilita la programación de tareas (@Scheduled)
public class AsociacionApplication {

	public static void main(String[] args) {
		SpringApplication.run(AsociacionApplication.class, args);
        
	}
}
