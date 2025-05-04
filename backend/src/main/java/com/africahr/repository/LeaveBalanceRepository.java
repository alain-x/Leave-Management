package com.africahr.repository;

import com.africahr.entity.LeaveBalance;
import com.africahr.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByUserId(Long userId);
    Optional<LeaveBalance> findByUserIdAndLeaveType(Long userId, LeaveType leaveType);
    List<LeaveBalance> findByUserIdAndLeaveTypeId(Long userId, Long leaveTypeId);
}