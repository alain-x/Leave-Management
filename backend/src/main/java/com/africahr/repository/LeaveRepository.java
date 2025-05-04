package com.africahr.repository;

import com.africahr.entity.Leave;
import com.africahr.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByUser_Email(String email);
    List<Leave> findByStatus(String status);
    List<Leave> findByApprover_Email(String email);
    List<Leave> findByUser(User user);
}
