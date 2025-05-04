package com.africahr.controller;

import com.africahr.dto.request.LeaveRequest;
import com.africahr.dto.response.LeaveResponse;
import com.africahr.exception.LeaveManagementException;
import com.africahr.service.LeaveService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService;

    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<LeaveResponse>> getLeaveBalance() {
        return ResponseEntity.ok(leaveService.getLeaveBalance());
    }

    @GetMapping("/requests")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<LeaveResponse>> getLeaveRequests() {
        return ResponseEntity.ok(leaveService.getLeaveRequests());
    }


    @PostMapping("/requests")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<?> createLeaveRequest(
            @RequestPart("request") String leaveRequestJson,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            LeaveRequest leaveRequest = objectMapper.readValue(leaveRequestJson, LeaveRequest.class);

            return ResponseEntity.ok(leaveService.createLeaveRequest(leaveRequest, documents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/requests/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> approveLeaveRequest(
            @PathVariable Long id,
            @RequestParam String comment) {
        try {
            return ResponseEntity.ok(leaveService.approveLeave(id, comment));
        } catch (LeaveManagementException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/requests/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestParam String comment) {
        try {
            return ResponseEntity.ok(leaveService.rejectLeave(id, comment));
        } catch (LeaveManagementException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}