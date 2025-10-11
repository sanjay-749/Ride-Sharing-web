package com.ridesharing.ridesharing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridesharing.ridesharing.model.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Driver findByEmail(String email);
}
