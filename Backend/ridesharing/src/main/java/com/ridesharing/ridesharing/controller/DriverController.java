package com.ridesharing.ridesharing.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.model.Ride;
import com.ridesharing.ridesharing.service.DriverService;
import com.ridesharing.ridesharing.service.RideService;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;
    private final RideService rideService;

    public DriverController(DriverService driverService, RideService rideService) {
        this.driverService = driverService;
        this.rideService = rideService;
    }

    // ---------------- Driver Signup ----------------
    @PostMapping("/signup")
    public ResponseEntity<?> registerDriver(@RequestBody Driver driver) {
        Driver savedDriver = driverService.registerDriver(driver);
        String token = driverService.generateToken(savedDriver.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "driver", savedDriver));
    }

    // ---------------- Driver Login ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String token = driverService.login(loginRequest.get("email"), loginRequest.get("password"));
        if (token != null) {
            Driver driver = driverService.getDriverByEmail(loginRequest.get("email"));
            return ResponseEntity.ok(Map.of("token", token, "driver", driver));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }

    // ---------------- Get Driver by ID ----------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        return driver != null ? ResponseEntity.ok(driver) :
                ResponseEntity.status(404).body(Map.of("error", "Driver not found"));
    }

    // ---------------- Update Driver ----------------
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        Driver updated = driverService.updateDriver(id, driver);
        return updated != null ? ResponseEntity.ok(updated) :
                ResponseEntity.status(404).body(Map.of("error", "Driver not found"));
    }

    // ---------------- Driver Summary / Stats ----------------
    @GetMapping("/{id}/summary")
    public ResponseEntity<?> getDriverSummary(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        int totalRides = rideService.getRidesByDriver(driver).size();
        int completedRides = rideService.getRidesByDriverAndStatus(driver, "Completed").size();
        double todayEarnings = rideService.getEarnings(driver, LocalDate.now());
        double weeklyEarnings = rideService.getEarnings(driver, LocalDate.now().minusDays(7));

        Map<String, Object> summary = Map.of(
                "totalRides", totalRides,
                "completedRides", completedRides,
                "todayEarnings", todayEarnings,
                "weeklyEarnings", weeklyEarnings
        );

        return ResponseEntity.ok(summary);
    }

    // ---------------- Driver Earnings Details ----------------
    @GetMapping("/{id}/earnings")
    public ResponseEntity<?> getDriverEarnings(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        double todayEarnings = rideService.getEarnings(driver, LocalDate.now());
        double weeklyEarnings = rideService.getEarnings(driver, LocalDate.now().minusDays(7));
        List<Ride> completedRides = rideService.getRidesByDriverAndStatus(driver, "Completed");

        Map<String, Object> earnings = Map.of(
                "todayEarnings", todayEarnings,
                "weeklyEarnings", weeklyEarnings,
                "completedRides", completedRides
        );

        return ResponseEntity.ok(earnings);
    }

    // ---------------- Accept a Ride ----------------
    @PostMapping("/{driverId}/rides/{rideId}/accept")
    public ResponseEntity<?> acceptRide(@PathVariable Long driverId, @PathVariable Long rideId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        Ride ride = rideService.acceptRide(rideId, driver);
        if (ride == null) return ResponseEntity.status(404).body(Map.of("error", "Ride not found or already accepted"));

        return ResponseEntity.ok(Map.of("ride", ride));
    }

    // ---------------- Current Active Ride ----------------
    @GetMapping("/{driverId}/current-ride")
    public ResponseEntity<?> getCurrentRide(@PathVariable Long driverId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        Ride currentRide = rideService.getActiveRideByDriver(driver);

        if (currentRide == null) 
            return ResponseEntity.ok(Map.of("message", "No ride in progress"));

        return ResponseEntity.ok(Map.of("ride", currentRide));
    }
}
