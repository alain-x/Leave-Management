package com.africahr.service;

import com.africahr.dto.request.LeaveRequest;
import com.africahr.dto.response.LeaveResponse;
import com.africahr.entity.*;
import com.africahr.enums.LeaveStatus;
import com.africahr.enums.Role;
import com.africahr.exception.LeaveManagementException;
import com.africahr.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {
    private static final Logger logger = LoggerFactory.getLogger(LeaveService.class);

    private final LeaveRepository leaveRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeavePolicyRepository leavePolicyRepository;
    private final EmailService emailService;
    private final DocumentStorageService documentStorageService;

    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeaveBalance() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        return leaveBalanceRepository.findByUserId(user.getId()).stream()
                .map(this::convertToLeaveResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeaveRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        List<Leave> leaves = user.getRole() == Role.MANAGER || user.getRole() == Role.ADMIN
                ? leaveRepository.findAll()
                : leaveRepository.findByUser(user);

        return leaves.stream()
                .map(this::convertToLeaveResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponse createLeaveRequest(LeaveRequest request, List<MultipartFile> documents) {
        validateLeaveRequest(request);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        LeaveType leaveType = leaveTypeRepository.findByName(request.getLeaveType())
                .orElseThrow(() -> new LeaveManagementException(
                        String.format("Invalid leave type '%s'. Available types: %s",
                                request.getLeaveType(),
                                getAvailableLeaveTypes())
                ));

        long duration = calculateLeaveDuration(request.getStartDate(), request.getEndDate());
        validateLeaveBalance(user, leaveType, duration);

        Leave leave = buildLeaveRequest(user, leaveType, request);
        storeDocuments(leave, documents);

        Leave savedLeave = leaveRepository.save(leave);
        notifyManager(user, savedLeave);

        return convertToLeaveResponse(savedLeave);
    }

    @Transactional
    public LeaveResponse approveLeave(Long leaveId, String comment) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User approver = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new LeaveManagementException("Leave request not found"));

        validateApproverRights(approver);

        long duration = calculateLeaveDuration(leave.getStartDate(), leave.getEndDate());
        updateLeaveBalance(leave, duration);

        leave = updateLeaveStatus(leave, approver, comment, LeaveStatus.APPROVED);
        emailService.sendLeaveApprovalNotification(leave.getUser().getEmail(), leave);

        return convertToLeaveResponse(leave);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, String comment) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User approver = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeaveManagementException("User not found"));

        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new LeaveManagementException("Leave request not found"));

        validateApproverRights(approver);

        leave = updateLeaveStatus(leave, approver, comment, LeaveStatus.REJECTED);
        emailService.sendLeaveRejectionNotification(leave.getUser().getEmail(), leave);

        return convertToLeaveResponse(leave);
    }


    private long calculateLeaveDuration(LocalDate startDate, LocalDate endDate) {
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }

    private void validateLeaveBalance(User user, LeaveType leaveType, long duration) {
        LeaveBalance balance = leaveBalanceRepository.findByUserIdAndLeaveType(user.getId(), leaveType)
                .orElseThrow(() -> new LeaveManagementException(
                        String.format("No leave balance found for type %s", leaveType.getName()))
                );

        if (balance.getRemainingDays() < duration) {
            throw new LeaveManagementException(
                    String.format("Insufficient leave balance. Requested: %d days, Available: %.1f days",
                            duration, balance.getRemainingDays())
            );
        }
    }

    private Leave buildLeaveRequest(User user, LeaveType leaveType, LeaveRequest request) {
        return Leave.builder()
                .user(user)
                .leaveType(leaveType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private void storeDocuments(Leave leave, List<MultipartFile> documents) {
        if (documents != null && !documents.isEmpty()) {
            List<String> documentUrls = documents.stream()
                    .map(file -> {
                        try {
                            return documentStorageService.storeDocument(file);
                        } catch (Exception e) {
                            logger.error("Failed to store document", e);
                            throw new LeaveManagementException("Failed to store document: " + e.getMessage());
                        }
                    })
                    .collect(Collectors.toList());
            leave.setDocumentUrls(documentUrls);
        }
    }

    private void notifyManager(User user, Leave leave) {
        if (user.getManager() != null) {
            emailService.sendLeaveRequestNotification(user.getManager().getEmail(), leave);
        }
    }

    private void validateApproverRights(User approver) {
        if (approver.getRole() != Role.MANAGER && approver.getRole() != Role.ADMIN) {
            throw new LeaveManagementException("Unauthorized to approve/reject leave");
        }
    }

    private void updateLeaveBalance(Leave leave, long duration) {
        LeaveBalance balance = leaveBalanceRepository.findByUserIdAndLeaveType(
                        leave.getUser().getId(), leave.getLeaveType())
                .orElseThrow(() -> new LeaveManagementException("No leave balance found"));

        balance.setRemainingDays(balance.getRemainingDays() - duration);
        leaveBalanceRepository.save(balance);
    }

    private Leave updateLeaveStatus(Leave leave, User approver, String comment, LeaveStatus status) {
        leave.setApprover(approver);
        leave.setApproverComment(comment);
        leave.setStatus(status);
        leave.setUpdatedAt(LocalDateTime.now());
        return leaveRepository.save(leave);
    }

    private List<String> getAvailableLeaveTypes() {
        return leaveTypeRepository.findAll().stream()
                .map(LeaveType::getName)
                .collect(Collectors.toList());
    }

    private LeaveResponse convertToLeaveResponse(Leave leave) {
        return LeaveResponse.builder()
                .id(leave.getId())
                .userId(leave.getUser().getId())
                .userName(leave.getUser().getFullName())
                .leaveType(leave.getLeaveType().getName())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus().name())
                .createdAt(leave.getCreatedAt())
                .updatedAt(leave.getUpdatedAt())
                .approverComment(leave.getApproverComment())
                .documentUrls(leave.getDocumentUrls())
                .build();
    }

    private LeaveResponse convertToLeaveResponse(LeaveBalance balance) {
        return LeaveResponse.builder()
                .userId(balance.getUser().getId())
                .userName(balance.getUser().getFullName())
                .leaveType(balance.getLeaveType().getName())
                .remainingDays(balance.getRemainingDays())
                .totalDays(balance.getTotalDays())
                .build();
    }

    private void validateLeaveRequest(LeaveRequest request) {
        if (request.getStartDate() == null) {
            throw new LeaveManagementException("Start date is required");
        }
        if (request.getEndDate() == null) {
            throw new LeaveManagementException("End date is required");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new LeaveManagementException("Start date cannot be after end date");
        }
    }
}