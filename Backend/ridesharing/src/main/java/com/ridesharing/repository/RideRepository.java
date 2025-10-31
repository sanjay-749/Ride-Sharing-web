package com.ridesharing.repository;

import com.ridesharing.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    
    // Find all rides by user ID, ordered by creation date (newest first)
    List<Ride> findByUserIdOrderByIdDesc(Long userId);
    
    // Find completed rides by user ID
    List<Ride> findByUserIdAndStatusOrderByIdDesc(Long userId, String status);
    
    // Find rides by payment status
    List<Ride> findByUserIdAndPaymentStatusOrderByIdDesc(Long userId, String paymentStatus);
    
    // Alternative query using @Query annotation
    @Query("SELECT r FROM Ride r WHERE r.userId = :userId ORDER BY r.id DESC")
    List<Ride> findUserRidesOrderedByDate(@Param("userId") Long userId);
}