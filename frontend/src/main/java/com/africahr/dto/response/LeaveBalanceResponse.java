package com.africahr.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceResponse {
    private String leaveType;
    private double balance;
    private double totalDays;
    private double usedDays;
    private double remainingDays;
}
