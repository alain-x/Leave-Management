package com.africahr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TwoFactorResponse {
    private String message;
    private TwoFactorData data;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TwoFactorData {
        private String secret;
        private String qrCodeUrl;
        private String message;
    }

    public static TwoFactorResponse create(String secret, String qrCodeUrl) {
        return TwoFactorResponse.builder()
                .message("2FA secret generated")
                .data(TwoFactorData.builder()
                        .secret(secret)
                        .qrCodeUrl(qrCodeUrl)
                        .message("Your 2FA code is: " + secret + ". Please save this code securely.")
                        .build())
                .build();
    }
} 