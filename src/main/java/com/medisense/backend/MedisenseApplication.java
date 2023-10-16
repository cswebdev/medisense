package com.medisense.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = {
		"classpath:application.properties",
		"classpath:secrets.properties"
}, ignoreResourceNotFound = true)
public class MedisenseApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedisenseApplication.class, args);
	}

}
