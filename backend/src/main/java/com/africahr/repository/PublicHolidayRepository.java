package com.africahr.repository;

import com.africahr.entity.PublicHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PublicHolidayRepository extends JpaRepository<PublicHoliday, Long> {
    List<PublicHoliday> findByDateBetween(LocalDate start, LocalDate end);
    List<PublicHoliday> findByDate(LocalDate date);
} 