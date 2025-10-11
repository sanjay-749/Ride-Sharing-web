package com.ridesharing.ridesharing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.model.Ride;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriver(Driver driver);
    List<Ride> findByStatusIgnoreCase(String status);
}
