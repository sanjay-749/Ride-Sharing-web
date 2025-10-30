package com.ridesharing.ridesharing.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.repository.DriverRepository;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private JwtService jwtService;

    // Register a new driver
    public Driver registerDriver(Driver driver) {
        // status is already "active" by default in entity
        return driverRepository.save(driver);
    }

    // Generate token using JwtService
    public String generateToken(String email) {
        return jwtService.generateToken(email);
    }

    // Login check
    public String login(String email, String password) {
        Driver driver = driverRepository.findByEmail(email);
        if (driver != null && driver.getPassword().equals(password)) {
            return jwtService.generateToken(email);
        }
        return null;
    }

    // Get driver by ID
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElse(null);
    }

    // Get driver by Email
    public Driver getDriverByEmail(String email) {
        return driverRepository.findByEmail(email);
    }

    // Update driver
    public Driver updateDriver(Long id, Driver updatedDriver) {
        return driverRepository.findById(id).map(driver -> {
            driver.setName(updatedDriver.getName());
            driver.setEmail(updatedDriver.getEmail());
            driver.setPhone(updatedDriver.getPhone());
            driver.setVehicleNumber(updatedDriver.getVehicleNumber());
            driver.setVehicleType(updatedDriver.getVehicleType());
            driver.setVehicleName(updatedDriver.getVehicleName());
            driver.setStatus(updatedDriver.getStatus());
            driver.setPassword(updatedDriver.getPassword());
            return driverRepository.save(driver);
        }).orElse(null);
    }

    // List all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
}
