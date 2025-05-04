package com.africahr.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leave_types")
public class LeaveType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double defaultBalance;

    @Column(nullable = false)
    private double monthlyAccrual;

    @Column(nullable = false)
    private int maxCarryForward;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private boolean requiresMedicalCertificate;

    @Column(nullable = false)
    private boolean requiresApproval;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @OneToMany(mappedBy = "leaveType")
    private List<LeaveBalance> leaveBalances;

    @OneToMany(mappedBy = "leaveType")
    private List<LeaveRequest> leaveRequests;

    @OneToMany(mappedBy = "leaveType")
    private List<LeavePolicy> policies;

    public double calculateMonthlyAccrual() {
        return monthlyAccrual;
    }

    public double calculateCarryForward(LeaveBalance balance) {
        double remaining = balance.getBalance() - balance.getUsed();
        return Math.min(remaining, maxCarryForward);
    }
}
