package com.africahr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String status;
    private String approverComment;
    private List<String> documentUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private double remainingDays;
    private double totalDays;
}
