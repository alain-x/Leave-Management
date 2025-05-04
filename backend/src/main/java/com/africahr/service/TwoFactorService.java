package com.africahr.service;

import com.africahr.dto.request.TwoFactorGenerateRequest;
import com.africahr.dto.response.TwoFactorResponse;
import com.africahr.entity.User;
import com.africahr.repository.UserRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TwoFactorService {

    private final GoogleAuthenticator gAuth;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public Map<String, Object> generateSecret(TwoFactorGenerateRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();
        
        // Generate a random 6-digit number
        String numericSecret = String.format("%06d", random.nextInt(1000000));
        
        // Generate a key using GoogleAuthenticator
        GoogleAuthenticatorKey key = gAuth.createCredentials();
        
        // Save the secret to the user
        user.setTwoFactorSecret(numericSecret);
        userRepository.save(user);

        // Generate QR code URL
        String qrCodeUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL(
            "LeaveManagementSystem",
            user.getEmail(),
            key
        );

        Map<String, Object> response = new HashMap<>();
        response.put("message", "2FA secret generated");
        
        Map<String, Object> data = new HashMap<>();
        data.put("secret", numericSecret);
        data.put("qrCodeUrl", qrCodeUrl);
        data.put("message", "Your 2FA code is: " + numericSecret + ". Please save this code securely.");
        
        response.put("data", data);
        return response;
    }

    public boolean verifyCode(String code) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the user's Google Authenticator key
        String secretKey = user.getTwoFactorSecret();
        if (secretKey == null) {
            throw new RuntimeException("2FA is not enabled for this user");
        }

        // Verify the code using Google Authenticator
        return gAuth.authorize(secretKey, Integer.parseInt(code));
    }

    public void enableTwoFactor() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    public void disableTwoFactor() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);
    }
} 