package com.legalease.repository;

import com.legalease.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {
    List<Court> findByCity(String city);
    List<Court> findByType(String type);
}
