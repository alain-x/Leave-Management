package com.africahr.repository;

import com.africahr.entity.LeaveRequest;
import com.africahr.entity.LeaveStatus;
import com.africahr.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUser(User user);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByUserAndStatus(User user, LeaveStatus status);
    List<LeaveRequest> findByStartDateBetween(LocalDate start, LocalDate end);
    List<LeaveRequest> findByUserAndStartDateBetween(User user, LocalDate start, LocalDate end);
} 