package com.ridesharing.ridesharing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ridesharing.ridesharing.model.Driver;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    // Find driver by email
    Driver findByEmail(String email);
}
