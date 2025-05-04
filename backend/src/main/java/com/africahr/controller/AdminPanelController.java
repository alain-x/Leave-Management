package com.africahr.controller;

import com.africahr.dto.AdminPanelDTO;
import com.africahr.service.AdminPanelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPanelController {

    @Autowired
    private AdminPanelService adminPanelService;

    @GetMapping("/leave-types")
    public ResponseEntity<List<AdminPanelDTO>> getAllLeaveTypes() {
        return ResponseEntity.ok(adminPanelService.getAllLeaveTypes());
    }

    @GetMapping("/leave-types/{id}")
    public ResponseEntity<AdminPanelDTO> getLeaveTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(adminPanelService.getLeaveTypeById(id));
    }

    @PostMapping("/leave-types")
    public ResponseEntity<AdminPanelDTO> createLeaveType(@Valid @RequestBody AdminPanelDTO dto) {
        return ResponseEntity.ok(adminPanelService.createLeaveType(dto));
    }

    @PutMapping("/leave-types/{id}")
    public ResponseEntity<AdminPanelDTO> updateLeaveType(
            @PathVariable Long id,
            @Valid @RequestBody AdminPanelDTO dto) {
        return ResponseEntity.ok(adminPanelService.updateLeaveType(id, dto));
    }

    @DeleteMapping("/leave-types/{id}")
    public ResponseEntity<Void> deleteLeaveType(@PathVariable Long id) {
        adminPanelService.deleteLeaveType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/leave-types/active")
    public ResponseEntity<List<AdminPanelDTO>> getActiveLeaveTypes() {
        return ResponseEntity.ok(adminPanelService.getActiveLeaveTypes());
    }
}
