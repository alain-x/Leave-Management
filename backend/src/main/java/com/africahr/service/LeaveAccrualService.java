package com.africahr.service;

import com.africahr.entity.LeaveAccrual;
import com.africahr.entity.LeaveBalance;
import com.africahr.entity.LeaveType;
import com.africahr.entity.User;
import com.africahr.repository.LeaveAccrualRepository;
import com.africahr.repository.LeaveBalanceRepository;
import com.africahr.repository.LeaveTypeRepository;
import com.africahr.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveAccrualService {

    @Autowired
    private LeaveAccrualRepository leaveAccrualRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private UserRepository userRepository;

    private static final double MONTHLY_PTO_ACCRUAL = 1.66;
    private static final int MAX_CARRYOVER_DAYS = 5;

    // Monthly accrual job
    @Scheduled(cron = "0 0 0 1 * ?") // Runs at midnight on the 1st of every month
    @Transactional
    public void processMonthlyAccruals() {
        List<User> activeUsers = userRepository.findByActiveTrue();
        
        for (User user : activeUsers) {
            processUserAccrual(user);
        }
    }

    @Transactional
    public void processUserAccrual(User user) {
        LocalDate today = LocalDate.now();
        
        // Process PTO accrual
        LeaveType ptoLeaveType = leaveTypeRepository.findByCode("PTO");
        if (ptoLeaveType != null) {
            double daysToAccrue = MONTHLY_PTO_ACCRUAL;
            
            // Check if we need to carry over from previous year
            if (today.getMonthValue() == 1) { // January
                handleYearEndCarryover(user, ptoLeaveType);
            }
            
            // Create new accrual record
            LeaveAccrual accrual = new LeaveAccrual();
            accrual.setUser(user);
            accrual.setLeaveType(ptoLeaveType);
            accrual.setDaysAccrued(daysToAccrue);
            accrual.setAccrualDate(today);
            accrual.setExpiryDate(today.plusYears(1));
            accrual.setStatus(LeaveAccrual.AccrualStatus.ACTIVE);
            
            leaveAccrualRepository.save(accrual);
            
            // Update leave balance
            List<LeaveBalance> balances = leaveBalanceRepository.findByUserIdAndLeaveTypeId(
                user.getId(), ptoLeaveType.getId());
            LeaveBalance balance;
            if (balances.isEmpty()) {
                balance = new LeaveBalance();
                balance.setUser(user);
                balance.setLeaveType(ptoLeaveType);
                balance.setBalance(daysToAccrue);
                balance.setTotalDays(daysToAccrue);
                balance.setUsedDays(0);
                balance.setRemainingDays(daysToAccrue);
            } else {
                balance = balances.get(0);
                double currentBalance = balance.getBalance();
                balance.setBalance(currentBalance + daysToAccrue);
                balance.setTotalDays(balance.getTotalDays() + daysToAccrue);
                balance.setRemainingDays(balance.getRemainingDays() + daysToAccrue);
            }
            leaveBalanceRepository.save(balance);
        }
    }

    @Transactional
    private void handleYearEndCarryover(User user, LeaveType ptoLeaveType) {
        LocalDate today = LocalDate.now();
        LocalDate expiryDate = today.minusDays(1); // Last day of previous year
        
        // Get all active accruals from previous year
        List<LeaveAccrual> activeAccruals = leaveAccrualRepository.findByUserIdAndLeaveTypeIdAndStatus(
            user.getId(), ptoLeaveType.getId(), LeaveAccrual.AccrualStatus.ACTIVE);
            
        double totalCarryover = 0;
        for (LeaveAccrual accrual : activeAccruals) {
            if (accrual.getExpiryDate().isAfter(expiryDate)) {
                totalCarryover += accrual.getDaysAccrued();
            }
        }
        
        // Cap carryover at 5 days
        if (totalCarryover > MAX_CARRYOVER_DAYS) {
            totalCarryover = MAX_CARRYOVER_DAYS;
        }
        
        // Create carryover record
        LeaveAccrual carryover = new LeaveAccrual();
        carryover.setUser(user);
        carryover.setLeaveType(ptoLeaveType);
        carryover.setDaysAccrued(totalCarryover);
        carryover.setAccrualDate(today);
        carryover.setExpiryDate(today.plusDays(31)); // Expires by Jan 31st
        carryover.setStatus(LeaveAccrual.AccrualStatus.CARRIED_OVER);
        leaveAccrualRepository.save(carryover);
        
        // Update leave balance
        List<LeaveBalance> balances = leaveBalanceRepository.findByUserIdAndLeaveTypeId(
            user.getId(), ptoLeaveType.getId());
        if (!balances.isEmpty()) {
            LeaveBalance balance = balances.get(0);
            double currentBalance = balance.getBalance();
            balance.setBalance(currentBalance + totalCarryover);
            balance.setTotalDays(balance.getTotalDays() + totalCarryover);
            balance.setRemainingDays(balance.getRemainingDays() + totalCarryover);
            leaveBalanceRepository.save(balance);
        }
    }
}
