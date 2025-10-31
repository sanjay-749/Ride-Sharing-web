package com.ridesharing.ridesharing.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ridesharing.ridesharing.entity.Driver;
import com.ridesharing.ridesharing.repository.DriverRepository;
import com.ridesharing.ridesharing.security.JwtUtil;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Driver registerDriver(Driver driver) {
        // hash password
        driver.setPassword(passwordEncoder.encode(driver.getPassword()));
        driver.setRole("ROLE_DRIVER");
        return driverRepository.save(driver);
    }

    public String generateToken(String email) {
        Driver d = driverRepository.findByEmail(email);
        String role = (d != null) ? d.getRole() : "ROLE_DRIVER";
        return jwtUtil.generateToken(email, role);
    }

    public String login(String email, String rawPassword) {
        Driver driver = driverRepository.findByEmail(email);
        if (driver != null && passwordEncoder.matches(rawPassword, driver.getPassword())) {
            return jwtUtil.generateToken(email, driver.getRole());
        }
        return null;
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElse(null);
    }

    public Driver getDriverByEmail(String email) {
        return driverRepository.findByEmail(email);
    }

    public Driver updateDriver(Long id, Driver updatedDriver) {
        return driverRepository.findById(id).map(driver -> {
            driver.setName(updatedDriver.getName());
            driver.setEmail(updatedDriver.getEmail());
            driver.setPhone(updatedDriver.getPhone());
            driver.setVehicleNumber(updatedDriver.getVehicleNumber());
            driver.setVehicleType(updatedDriver.getVehicleType());
            driver.setVehicleName(updatedDriver.getVehicleName());
            driver.setStatus(updatedDriver.getStatus());
            if (updatedDriver.getPassword() != null && !updatedDriver.getPassword().isBlank()) {
                driver.setPassword(passwordEncoder.encode(updatedDriver.getPassword()));
            }
            return driverRepository.save(driver);
        }).orElse(null);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
}
