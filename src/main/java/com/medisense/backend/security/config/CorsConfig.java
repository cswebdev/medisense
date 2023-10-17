package com.medisense.backend.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("CorsConfig addCorsMappings method invoked");
        registry.addMapping("/api/*")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}