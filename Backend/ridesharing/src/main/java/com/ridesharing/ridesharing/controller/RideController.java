package com.ridesharing.ridesharing.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridesharing.ridesharing.model.Ride;
import com.ridesharing.ridesharing.service.RideService;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    // Get all rides
    @GetMapping
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.ok(rideService.getAllRides());
    }

    // Get rides by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ride>> getRidesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(rideService.getRidesByStatus(status));
    }

    // Add a new ride
    @PostMapping
    public ResponseEntity<Ride> addRide(@RequestBody Ride ride) {
        return ResponseEntity.ok(rideService.addRide(ride));
    }

    // Delete ride by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRide(@PathVariable Long id) {
        rideService.deleteRide(id);
        return ResponseEntity.ok("Ride deleted successfully");
    }
}
