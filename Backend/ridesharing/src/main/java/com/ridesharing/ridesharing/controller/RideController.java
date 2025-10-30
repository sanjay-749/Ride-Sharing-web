package com.ridesharing.ridesharing.controller;

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
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;
    private final DriverService driverService;

    public RideController(RideService rideService, DriverService driverService) {
        this.rideService = rideService;
        this.driverService = driverService;
    }

    // ---------------- Get pending ride offers ----------------
    @GetMapping("/offers")
    public ResponseEntity<?> getRideOffers() {
        List<Ride> pendingRides = rideService.getPendingRides(); // Only status=pending and driver=null
        return ResponseEntity.ok(Map.of("rides", pendingRides));
    }

    // ---------------- Accept a ride ----------------
    @PostMapping("/{rideId}/accept/{driverId}")
    public ResponseEntity<?> acceptRide(@PathVariable Long rideId, @PathVariable Long driverId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver == null)
            return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        Ride ride = rideService.acceptRide(rideId, driver);
        if (ride == null)
            return ResponseEntity.status(404).body(Map.of("error", "Ride not found or already assigned"));

        return ResponseEntity.ok(Map.of("ride", ride));
    }

    // ---------------- Update ride status ----------------
    @PutMapping("/{rideId}/status")
    public ResponseEntity<?> updateRideStatus(@PathVariable Long rideId, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Missing status"));

        Ride ride = rideService.updateRideStatus(rideId, status);
        if (ride == null)
            return ResponseEntity.status(404).body(Map.of("error", "Ride not found"));

        return ResponseEntity.ok(Map.of("ride", ride));
    }

    // ---------------- Get current ride for driver ----------------
    @GetMapping("/driver/{driverId}/current")
    public ResponseEntity<?> getCurrentRide(@PathVariable Long driverId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver == null)
            return ResponseEntity.status(404).body(Map.of("error", "Driver not found"));

        Ride activeRide = rideService.getActiveRideByDriver(driver);
        if (activeRide == null)
            return ResponseEntity.ok(Map.of("message", "No active ride"));

        return ResponseEntity.ok(Map.of("ride", activeRide));
    }
}
