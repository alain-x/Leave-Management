package com.africahr.config;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleAuthenticatorBeanConfig {

    @Bean
    public GoogleAuthenticator googleAuthenticator() {
        GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder configBuilder = new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder();
        configBuilder.setTimeStepSizeInMillis(30000); // 30 seconds
        configBuilder.setWindowSize(3); // Allow 3 time steps before and after
        configBuilder.setNumberOfScratchCodes(5); // Generate 5 scratch codes
        configBuilder.setCodeDigits(6); // 6-digit codes

        return new GoogleAuthenticator(configBuilder.build());
    }
} 