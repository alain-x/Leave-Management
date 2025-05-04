package com.africahr.entity;

import com.africahr.enums.LeaveStatus;
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
@Table(name = "leave_requests")
public class LeaveRequest {
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
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column
    private String reason;

    @Column
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column
    private String rejectionReason;

    @ManyToOne
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column
    private LocalDate approvedAt;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    private LeavePolicy policy;

    @OneToMany(mappedBy = "leaveRequest", cascade = CascadeType.ALL)
    private List<LeaveRequestComment> comments;
} 