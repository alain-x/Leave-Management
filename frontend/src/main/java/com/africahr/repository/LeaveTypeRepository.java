package com.africahr.repository;

import com.africahr.entity.LeaveType;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {
    List<LeaveType> findByActiveTrue();
    LeaveType findByCode(String code);
    Optional<LeaveType> findByName(@NotBlank(message = "Leave type is required") String name);
    boolean existsByName(String name);
}
