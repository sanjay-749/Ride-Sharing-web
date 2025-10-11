package com.ridesharing.ridesharing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.repository.DriverRepository;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // Get all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // Get driver by ID
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElse(null);
    }

    // Add new driver
    public Driver addDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    // Delete driver
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

    // Login driver
    public Driver login(String email, String password) {
        Driver driver = driverRepository.findByEmail(email);
        if (driver != null && driver.getPassword().equals(password)) {
            return driver;
        }
        return null;
    }
}
