package com.ridesharing.ridesharing.controller;

import com.ridesharing.ridesharing.entity.Ride;
import com.ridesharing.ridesharing.security.JwtUtil;
import com.ridesharing.ridesharing.service.RideService;
import com.ridesharing.ridesharing.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<?> bookRide(
            @RequestBody Ride ride,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        try {
            // Prefer authenticated user from JWT over any client-supplied userId
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractEmail(token);
                if (email != null) {
                    Long userId = userService.getUserIdByEmail(email);
                    if (userId != null) {
                        ride.setUserId(userId);
                    }
                }
            }

            if (ride.getUserId() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Authentication required to book a ride"));
            }

            Ride savedRide = rideService.createRide(ride);
            return ResponseEntity.ok(savedRide);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to book ride: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRide(@PathVariable Long id) {
        Ride ride = rideService.getRide(id);
        if (ride == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Ride not found"));
        }
        return ResponseEntity.ok(ride);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Ride updated = rideService.updateRideStatus(id, status);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Ride not found"));
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeRide(
            @PathVariable Long id,
            @RequestBody Map<String, String> updateData) {
        try {
            String status = updateData.get("status");
            String paymentMethod = updateData.get("paymentMethod");
            String paymentStatus = updateData.get("paymentStatus");

            Ride completedRide = rideService.completeRide(id, status, paymentMethod, paymentStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ride completed successfully");
            response.put("ride", completedRide);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to complete ride: " + e.getMessage()));
        }
    }

    @GetMapping("/user/history")
    public ResponseEntity<?> getUserRideHistory(
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Missing or invalid token"));
            }

            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            Long userId = userService.getUserIdByEmail(userEmail);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            List<Ride> userRides = rideService.getCompletedRidesByUserId(userId);
            return ResponseEntity.ok(userRides);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch ride history: " + e.getMessage()));
        }
    }
}
