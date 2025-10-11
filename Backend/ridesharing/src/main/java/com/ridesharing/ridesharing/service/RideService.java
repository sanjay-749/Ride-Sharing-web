package com.ridesharing.ridesharing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.model.Ride;
import com.ridesharing.ridesharing.repository.RideRepository;

@Service
public class RideService {

    private final RideRepository rideRepository;

    public RideService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    // Get all rides
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    // Add new ride
    public Ride addRide(Ride ride) {
        return rideRepository.save(ride);
    }

    // Delete ride by ID
    public void deleteRide(Long id) {
        rideRepository.deleteById(id);
    }

    // Get rides by driver
    public List<Ride> getRidesByDriver(Driver driver) {
        return rideRepository.findByDriver(driver);
    }

    // Get rides by status (ignore case)
    public List<Ride> getRidesByStatus(String status) {
        return rideRepository.findByStatusIgnoreCase(status);
    }
}
