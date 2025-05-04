package com.africahr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leave_balances")
public class LeaveBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    @Builder.Default
    private double totalDays = 0;

    @Column(nullable = false)
    @Builder.Default
    private double usedDays = 0;

    @Column(nullable = false)
    @Builder.Default
    private double remainingDays = 0;

    @Column
    @Builder.Default
    private double carriedOverDays = 0;

    @Column(nullable = false)
    @Builder.Default
    private double balance = 0;

    @Column
    private LocalDate lastAccrualDate;

    @Column
    private LocalDate lastCarryoverDate;

    @Column
    private LocalDate lastUpdated;

    @Column
    private LocalDate expiryDate;

    @ManyToOne
    @JoinColumn(name = "policy_id") // or whatever column name you prefer
    private LeavePolicy policy;

    // Custom getter for 'used' (if LeaveType.java expects getUsed())
    public double getUsed() {
        return this.usedDays;
    }

    // Business logic methods
    public void updateBalance() {
        this.remainingDays = this.totalDays - this.usedDays + this.carriedOverDays;
        this.balance = this.remainingDays;
        this.lastUpdated = LocalDate.now();
    }

    public void applyLeave(double days) {
        if (days > this.remainingDays) {
            throw new IllegalArgumentException("Insufficient leave balance");
        }
        this.usedDays += days;
        updateBalance();
    }

    public void carryOver(double days) {
        this.carriedOverDays = days;
        this.lastCarryoverDate = LocalDate.now();
        updateBalance();
    }
}