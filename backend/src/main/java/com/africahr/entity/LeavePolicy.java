package com.africahr.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.africahr.enums.LeaveType;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "leave_policies")
public class LeavePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;

    private double accrualRate; // days per month
    private double maxCarryover; // maximum days that can be carried over
    private int maxAnnualLeave; // maximum days per year
    private boolean requiresApproval;
    private boolean requiresDocuments;
    private int minimumNoticeDays;
    private String description;

    @Column
    private LocalDate effectiveDate;

    @Column
    private LocalDate expiryDate;

    @Column
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "policy")
    private List<LeaveRequest> leaveRequests;

    @OneToMany(mappedBy = "policy")
    private List<LeaveBalance> leaveBalances = new ArrayList<>();

    public boolean isValidForDate(LocalDate date) {
        return (effectiveDate == null || !date.isBefore(effectiveDate)) &&
               (expiryDate == null || !date.isAfter(expiryDate));
    }

    public double calculateAccrual(LocalDate startDate, LocalDate endDate) {
        long months = java.time.temporal.ChronoUnit.MONTHS.between(startDate, endDate);
        return months * accrualRate;
    }
}
