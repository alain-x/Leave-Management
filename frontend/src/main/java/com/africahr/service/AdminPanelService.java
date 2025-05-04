package com.africahr.service;

import com.africahr.dto.AdminPanelDTO;
import com.africahr.entity.LeaveType;
import com.africahr.repository.LeaveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminPanelService {

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    public List<AdminPanelDTO> getAllLeaveTypes() {
        List<LeaveType> leaveTypes = leaveTypeRepository.findAll();
        return leaveTypes.stream()
            .map(AdminPanelDTO::fromLeaveType)
            .collect(Collectors.toList());
    }

    public AdminPanelDTO getLeaveTypeById(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave type not found"));
        return AdminPanelDTO.fromLeaveType(leaveType);
    }

    public AdminPanelDTO createLeaveType(AdminPanelDTO dto) {
        LeaveType leaveType = new LeaveType();
        leaveType.setName(dto.getName());
        leaveType.setDescription(dto.getDescription());
        leaveType.setDefaultBalance(dto.getDefaultBalance());
        leaveType.setActive(dto.isActive());
        
        LeaveType saved = leaveTypeRepository.save(leaveType);
        return AdminPanelDTO.fromLeaveType(saved);
    }

    public AdminPanelDTO updateLeaveType(Long id, AdminPanelDTO dto) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave type not found"));
        
        leaveType.setName(dto.getName());
        leaveType.setDescription(dto.getDescription());
        leaveType.setDefaultBalance(dto.getDefaultBalance());
        leaveType.setActive(dto.isActive());
        
        LeaveType saved = leaveTypeRepository.save(leaveType);
        return AdminPanelDTO.fromLeaveType(saved);
    }

    public void deleteLeaveType(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave type not found"));
        
        leaveTypeRepository.delete(leaveType);
    }

    public List<AdminPanelDTO> getActiveLeaveTypes() {
        List<LeaveType> leaveTypes = leaveTypeRepository.findByActiveTrue();
        return leaveTypes.stream()
            .map(AdminPanelDTO::fromLeaveType)
            .collect(Collectors.toList());
    }
}
