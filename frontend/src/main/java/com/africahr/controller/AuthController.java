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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TwoFactorService twoFactorService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/2fa/generate")
    public ResponseEntity<?> generate2FASecret(@RequestBody TwoFactorGenerateRequest request) {
        return ResponseEntity.ok(twoFactorService.generateSecret(request));
    }

    @PostMapping("/2fa/verify")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_user')")
    public ResponseEntity<Boolean> verify2FA(@Valid @RequestBody TwoFactorRequest request) {
        return ResponseEntity.ok(twoFactorService.verifyCode(request.getCode()));
    }

    @PostMapping("/2fa/enable")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_user')")
    public ResponseEntity<Void> enable2FA() {
        twoFactorService.enableTwoFactor();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/2fa/disable")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_user')")
    public ResponseEntity<Void> disable2FA() {
        twoFactorService.disableTwoFactor();
        return ResponseEntity.ok().build();
    }
}