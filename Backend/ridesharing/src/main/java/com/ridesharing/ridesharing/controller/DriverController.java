package com.ridesharing.ridesharing.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ridesharing.ridesharing.entity.Driver;
import com.ridesharing.ridesharing.entity.Rider;
import com.ridesharing.ridesharing.service.DriverService;
import com.ridesharing.ridesharing.service.RiderService;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;
    private final RiderService riderService;

    public DriverController(DriverService driverService, RiderService riderService) {
        this.driverService = driverService;
        this.riderService = riderService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerDriver(@RequestBody Driver driver) {
        if (driverService.getDriverByEmail(driver.getEmail()) != null) {
            return ResponseEntity.status(409).body(Map.of("error", "Email already registered"));
        }
        Driver saved = driverService.registerDriver(driver);
        String token = driverService.generateToken(saved.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "driver", saved));
    }

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

    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        Driver d = driverService.getDriverById(id);
        return d != null ? ResponseEntity.ok(d) : ResponseEntity.status(404).body(Map.of("error", "Driver not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        Driver updated = driverService.updateDriver(id, driver);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.status(404).body(Map.of("error", "Driver not found"));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<?> getDriverSummary(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        int totalRides = riderService.getRidesByDriver(driver).size();
        int completedRides = riderService.getRidesByDriverAndStatus(driver, "Completed").size();
        double todayEarnings = riderService.getEarnings(driver, LocalDate.now());
        double weeklyEarnings = riderService.getEarnings(driver, LocalDate.now().minusDays(7));

        Map<String, Object> summary = Map.of(
                "totalRides", totalRides,
                "completedRides", completedRides,
                "todayEarnings", todayEarnings,
                "weeklyEarnings", weeklyEarnings
        );
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{id}/earnings")
    public ResponseEntity<?> getDriverEarnings(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        double todayEarnings = riderService.getEarnings(driver, LocalDate.now());
        double weeklyEarnings = riderService.getEarnings(driver, LocalDate.now().minusDays(7));
        List<Rider> completedRides = riderService.getRidesByDriverAndStatus(driver, "Completed");

        return ResponseEntity.ok(Map.of(
            "todayEarnings", todayEarnings,
            "weeklyEarnings", weeklyEarnings,
            "completedRides", completedRides
        ));
    }
}
