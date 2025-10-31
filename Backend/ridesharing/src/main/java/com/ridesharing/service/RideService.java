package com.ridesharing.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ridesharing.entity.Ride;
import com.ridesharing.repository.RideRepository;

@Service
public class RideService {

    private final RideRepository rideRepository;

    public RideService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    public Ride createRide(Ride ride) {
        ride.setStatus(cleanText(ride.getStatus()));
        ride.setPaymentStatus(cleanText(ride.getPaymentStatus()));
        ride.setPaymentMethod(cleanText(ride.getPaymentMethod()));
        ride.setPickup(cleanText(ride.getPickup()));
        ride.setDestination(cleanText(ride.getDestination()));
        ride.setVehicle(cleanText(ride.getVehicle()));
        
        if (ride.getStatus() == null) {
            ride.setStatus("Driver on the way");
        }
       
        if (ride.getUserId() == null) {
            ride.setUserId(1L);
        }
        
        if (ride.getPaymentStatus() == null) {
            ride.setPaymentStatus("pending");
        }
        return rideRepository.save(ride);
    }

    public Ride getRide(Long rideId) {
        Optional<Ride> ride = rideRepository.findById(rideId);
        return ride.orElse(null);
    }

    public Ride updateRideStatus(Long rideId, String status) {
        Optional<Ride> rideOptional = rideRepository.findById(rideId);
        if (rideOptional.isPresent()) {
            Ride ride = rideOptional.get();
            ride.setStatus(cleanText(status));
            return rideRepository.save(ride);
        }
        return null;
    }

    public Ride completeRide(Long rideId, String status, String paymentMethod, String paymentStatus) {
        Optional<Ride> rideOptional = rideRepository.findById(rideId);
        if (rideOptional.isPresent()) {
            Ride ride = rideOptional.get();
            ride.setStatus(cleanText(status != null ? status : "completed"));
            ride.setPaymentMethod(cleanText(paymentMethod));
            ride.setPaymentStatus(cleanText(paymentStatus != null ? paymentStatus : "completed"));
            return rideRepository.save(ride);
        }
        throw new RuntimeException("Ride not found with ID: " + rideId);
    }

    public List<Ride> getRidesByUserId(Long userId) {
        return rideRepository.findByUserIdOrderByIdDesc(userId);
    }

    public List<Ride> getCompletedRidesByUserId(Long userId) {
        return rideRepository.findByUserIdAndStatusOrderByIdDesc(userId, "completed");
    }

    public List<Ride> getRidesByUserIdAndStatus(Long userId, String status) {
        return rideRepository.findByUserIdAndStatusOrderByIdDesc(userId, cleanText(status));
    }

    private String cleanText(String input) {
        if (input == null) return null;
        return input.replaceAll("[^\\x00-\\x7F]", "");
    }
}