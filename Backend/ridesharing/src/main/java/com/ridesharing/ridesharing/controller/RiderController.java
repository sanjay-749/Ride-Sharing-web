package com.ridesharing.ridesharing.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ridesharing.ridesharing.entity.Driver;
import com.ridesharing.ridesharing.entity.Rider;
import com.ridesharing.ridesharing.service.DriverService;
import com.ridesharing.ridesharing.service.RiderService;

@RestController
@RequestMapping("/api/riders")
@CrossOrigin(origins = "*")
public class RiderController {

    private final RiderService riderService;
    private final DriverService driverService;

    public RiderController(RiderService riderService, DriverService driverService) {
        this.riderService = riderService;
        this.driverService = driverService;
    }

    @GetMapping("/offers")
    public ResponseEntity<?> getRideOffers() {
        List<Rider> pending = riderService.getPendingRides();
        return ResponseEntity.ok(Map.of("rides", pending));
    }

    @PostMapping("/{rideId}/accept/{driverId}")
    public ResponseEntity<?> acceptRide(@PathVariable Long rideId, @PathVariable Long driverId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        Rider r = riderService.acceptRide(rideId, driver);
        if (r == null) return ResponseEntity.status(404).body(Map.of("error", "Ride not found or already assigned"));
        return ResponseEntity.ok(Map.of("ride", r));
    }

    @PutMapping("/{rideId}/status")
    public ResponseEntity<?> updateRideStatus(@PathVariable Long rideId, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error","Missing status"));

        Rider updated = riderService.updateRideStatus(rideId, status);
        if (updated == null) return ResponseEntity.status(404).body(Map.of("error","Ride not found"));
        return ResponseEntity.ok(Map.of("ride", updated));
    }

    @GetMapping("/driver/{driverId}/current")
    public ResponseEntity<?> getCurrentRide(@PathVariable Long driverId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver == null) return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        Rider active = riderService.getActiveRideByDriver(driver);
        if (active == null) return ResponseEntity.ok(Map.of("message","No active ride"));
        return ResponseEntity.ok(Map.of("ride", active));
    }
}
