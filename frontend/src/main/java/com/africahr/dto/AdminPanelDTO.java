package com.africahr.dto;

import com.africahr.entity.LeaveType;
import lombok.Data;

@Data
public class AdminPanelDTO {
    private Long id;
    private String name;
    private String description;
    private double defaultBalance;
    private boolean active;
    
    public static AdminPanelDTO fromLeaveType(LeaveType leaveType) {
        AdminPanelDTO dto = new AdminPanelDTO();
        dto.setId(leaveType.getId());
        dto.setName(leaveType.getName());
        dto.setDescription(leaveType.getDescription());
        dto.setDefaultBalance(leaveType.getDefaultBalance());
        dto.setActive(leaveType.isActive());
        return dto;
    }
}
