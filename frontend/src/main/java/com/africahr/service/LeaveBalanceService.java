package com.africahr.service;

import com.africahr.dto.response.LeaveBalanceResponse;
import com.africahr.entity.LeaveBalance;
import com.africahr.entity.LeaveType;
import com.africahr.entity.User;
import com.africahr.exception.LeaveManagementException;
import com.africahr.repository.LeaveBalanceRepository;
import com.africahr.repository.LeaveTypeRepository;
import com.africahr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveBalanceService {
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    @Transactional(readOnly = true)
    public List<LeaveBalanceResponse> getLeaveBalances() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        return leaveBalanceRepository.findByUserId(user.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void accrueLeave() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        // Get all active leave types
        List<LeaveType> leaveTypes = leaveTypeRepository.findByActiveTrue();

        for (LeaveType leaveType : leaveTypes) {
            // Calculate monthly accrual (1.66 days per month for PTO)
            double accrual = leaveType.getMonthlyAccrual();

            // Get or create leave balance
            LeaveBalance balance = leaveBalanceRepository.findByUserIdAndLeaveTypeId(
                    user.getId(), leaveType.getId())
                    .stream()
                    .findFirst()
                    .orElse(new LeaveBalance());

            if (balance.getId() == null) {
                balance.setUser(user);
                balance.setLeaveType(leaveType);
                balance.setBalance(leaveType.getDefaultBalance());
            }

            // Add monthly accrual
            balance.setBalance(balance.getBalance() + accrual);
            leaveBalanceRepository.save(balance);
        }
    }

    @Transactional
    public void processYearEndCarryover() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        // Get all active leave types
        List<LeaveType> leaveTypes = leaveTypeRepository.findByActiveTrue();

        for (LeaveType leaveType : leaveTypes) {
            LeaveBalance balance = leaveBalanceRepository.findByUserIdAndLeaveTypeId(
                    user.getId(), leaveType.getId())
                    .stream()
                    .findFirst()
                    .orElse(null);

            if (balance != null) {
                // Calculate carryover (maximum 5 days)
                double carryover = Math.min(balance.getBalance(), leaveType.getMaxCarryForward());
                balance.setBalance(carryover);
                leaveBalanceRepository.save(balance);
            }
        }
    }

    private LeaveBalanceResponse convertToResponse(LeaveBalance balance) {
        return LeaveBalanceResponse.builder()
                .leaveType(balance.getLeaveType().getName())
                .balance(balance.getBalance())
                .build();
    }
}
