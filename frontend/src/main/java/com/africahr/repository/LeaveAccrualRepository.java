package com.africahr.repository;

import com.africahr.entity.LeaveAccrual;
import com.africahr.entity.LeaveAccrual.AccrualStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveAccrualRepository extends JpaRepository<LeaveAccrual, Long> {
    List<LeaveAccrual> findByUserIdAndLeaveTypeIdAndStatus(Long userId, Long leaveTypeId, AccrualStatus status);

    List<LeaveAccrual> findByUserIdAndLeaveTypeId(
        Long userId,
        Long leaveTypeId
    );
}
