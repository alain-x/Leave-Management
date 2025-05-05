package com.africahr.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${spring.mvc.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Value("${spring.mvc.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${spring.mvc.cors.allowed-headers:Authorization,Content-Type,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers}")
    private String allowedHeaders;

    @Value("${spring.mvc.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Set allowed origins with fallback
        configuration.setAllowedOrigins(allowedOrigins != null ? 
            Arrays.asList(allowedOrigins.split(",")) : 
            Collections.singletonList("http://localhost:3000"));
        
        // Set allowed methods with fallback
        configuration.setAllowedMethods(allowedMethods != null ? 
            Arrays.asList(allowedMethods.split(",")) : 
            Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Set allowed headers with fallback
        configuration.setAllowedHeaders(allowedHeaders != null ? 
            Arrays.asList(allowedHeaders.split(",")) : 
            Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        
        configuration.setAllowCredentials(allowCredentials);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 