package com.africahr.controller;

import com.africahr.dto.request.LoginRequest;
import com.africahr.dto.request.RegisterRequest;
import com.africahr.dto.request.TwoFactorRequest;
import com.africahr.dto.request.TwoFactorGenerateRequest;
import com.africahr.dto.response.AuthResponse;
import com.africahr.dto.response.TwoFactorResponse;
import com.africahr.service.AuthService;
import com.africahr.service.TwoFactorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TwoFactorService twoFactorService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Registration failed", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Registration failed", "An unexpected error occurred"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            
            // If 2FA is enabled, return a 202 status code
            if (response.isTwoFactorEnabled()) {
                return ResponseEntity.status(HttpStatus.ACCEPTED)
                        .body(response);
            }
            
            // If 2FA is disabled, return the token
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Login failed", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Login failed", "An unexpected error occurred"));
        }
    }

    @PostMapping("/2fa/generate")
    public ResponseEntity<?> generate2FASecret(@RequestBody TwoFactorGenerateRequest request) {
        try {
            TwoFactorResponse response = twoFactorService.generateSecret(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("2FA setup failed", "Failed to generate 2FA secret"));
        }
    }

    @PostMapping("/2fa/verify")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_user')")
    public ResponseEntity<?> verify2FA(@Valid @RequestBody TwoFactorRequest request) {
        try {
            boolean isValid = twoFactorService.verifyCode(request.getCode());
            if (isValid) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("2FA verification failed", "Invalid verification code"));
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("2FA verification failed", "An unexpected error occurred"));
        }
    }

    @PostMapping("/2fa/enable")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_user')")
    public ResponseEntity<?> enable2FA() {
        try {
            twoFactorService.enableTwoFactor();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("2FA enable failed", "Failed to enable 2FA"));
        }
    }

    @PostMapping("/2fa/disable")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_user')")
    public ResponseEntity<?> disable2FA() {
        try {
            twoFactorService.disableTwoFactor();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("2FA disable failed", "Failed to disable 2FA"));
        }
    }

    private static class ErrorResponse {
        private final String error;
        private final String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() {
            return error;
        }

        public String getMessage() {
            return message;
        }
    }
}