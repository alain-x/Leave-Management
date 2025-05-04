package com.africahr.repository;

import com.africahr.entity.LeavePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, Long> {
    Optional<Double> findAccrualRateByLeaveType(String leaveType);
    Optional<Double> findMaxCarryoverByLeaveType(String leaveType);
    Optional<LeavePolicy> findByLeaveType(String leaveType);
}
