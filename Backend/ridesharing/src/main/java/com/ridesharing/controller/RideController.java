package com.ridesharing.controller;

import com.ridesharing.entity.Ride;
import com.ridesharing.security.JwtUtil;
import com.ridesharing.service.RideService;
import com.ridesharing.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public RideController(RideService rideService, JwtUtil jwtUtil, UserService userService) {
        this.rideService = rideService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping
    public Ride bookRide(@RequestBody Ride ride) {
        System.out.println("Received booking request from frontend!");
        System.out.println("From: " + ride.getPickup());
        System.out.println("To: " + ride.getDestination());
        System.out.println("Vehicle: " + ride.getVehicle());
        System.out.println("Fare: " + ride.getFare());
        
        try {
            Ride savedRide = rideService.createRide(ride);
            System.out.println("Ride saved successfully with ID: " + savedRide.getId());
            return savedRide;
        } catch (Exception e) {
            System.out.println("Error saving ride: " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public Ride getRide(@PathVariable Long id) {
        return rideService.getRide(id);
    }

    @PutMapping("/{id}/status")
    public Ride updateStatus(@PathVariable Long id, @RequestParam String status) {
        return rideService.updateRideStatus(id, status);
    }

    @PutMapping("/{id}/complete")
    public Map<String, Object> completeRide(@PathVariable Long id, @RequestBody Map<String, String> updateData) {
        try {
            String status = updateData.get("status");
            String paymentMethod = updateData.get("paymentMethod");
            String paymentStatus = updateData.get("paymentStatus");
            
            System.out.println("Completing ride ID: " + id);
            System.out.println("Payment Method: " + paymentMethod);
            System.out.println("Payment Status: " + paymentStatus);
            
            Ride completedRide = rideService.completeRide(id, status, paymentMethod, paymentStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ride completed successfully");
            response.put("ride", completedRide);
            
            return response;
        } catch (Exception e) {
            System.out.println("Error completing ride: " + e.getMessage());
            throw new RuntimeException("Failed to complete ride: " + e.getMessage());
        }
    }

    @GetMapping("/user/history")
    public List<Ride> getUserRideHistory(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            
            System.out.println("Fetching ride history for user: " + userEmail);
            
            Long userId = userService.getUserIdByEmail(userEmail);
            
            if (userId == null) {
                System.out.println("User not found for email: " + userEmail);
                throw new RuntimeException("User not found");
            }
            
            List<Ride> userRides = rideService.getCompletedRidesByUserId(userId);
            System.out.println("Found " + userRides.size() + " completed rides for user: " + userEmail);
            
            return userRides;
        } catch (Exception e) {
            System.out.println("Error fetching user ride history: " + e.getMessage());
            throw new RuntimeException("Failed to fetch ride history: " + e.getMessage());
        }
    }
}