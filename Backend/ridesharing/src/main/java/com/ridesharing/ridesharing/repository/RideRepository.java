package com.ridesharing.ridesharing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.model.Ride;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByStatusIgnoreCase(String status);

    List<Ride> findByStatusIgnoreCaseAndDriverIsNull(String status);

    List<Ride> findByDriver(Driver driver);

    List<Ride> findByDriverAndStatusIgnoreCase(Driver driver, String status);
}
