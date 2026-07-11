package com.legalease.repository;

import com.legalease.entity.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface LawyerRepository extends JpaRepository<Lawyer, Long> {
    Optional<Lawyer> findByUserId(Long userId);

    List<Lawyer> findByIsVerified(boolean isVerified);

    List<Lawyer> findByAvailable(boolean available);

    @Query("SELECT l FROM Lawyer l WHERE l.isVerified = true AND " +
           "(:specialization IS NULL OR LOWER(l.specializations) LIKE LOWER(CONCAT('%', :specialization, '%'))) AND " +
           "(:location IS NULL OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "ORDER BY l.rating DESC")
    List<Lawyer> searchLawyers(@Param("specialization") String specialization,
                               @Param("location") String location);

    long countByIsVerified(boolean isVerified);
}
