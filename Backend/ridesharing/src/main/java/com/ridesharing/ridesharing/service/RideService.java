package com.ridesharing.ridesharing.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ridesharing.ridesharing.model.Driver;
import com.ridesharing.ridesharing.model.Ride;
import com.ridesharing.ridesharing.repository.RideRepository;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final JdbcTemplate jdbcTemplate;
    private static final Logger logger = LoggerFactory.getLogger(RideService.class);

    public RideService(RideRepository rideRepository, JdbcTemplate jdbcTemplate) {
        this.rideRepository = rideRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // ---------------- Fetch all pending rides ----------------
    public List<Ride> getPendingRides() {
        List<Ride> pendingRides = rideRepository.findByStatusIgnoreCase("pending");
        logger.info("Fetched {} pending rides", pendingRides.size());
        return pendingRides;
    }

    // ---------------- Accept a ride ----------------
    @Transactional
    public Ride acceptRide(Long rideId, Driver driver) {
        logger.info("Driver {} is attempting to accept ride {}", driver.getId(), rideId);

        return rideRepository.findById(rideId)
                .filter(r -> "pending".equalsIgnoreCase(r.getStatus()) && r.getDriver() == null)
                .map(r -> {
                    r.setDriver(driver);
                    r.setStatus("Arriving");
                    r.setRideTime(LocalDateTime.now());
                    logger.info("Ride {} accepted", r.getId());
                    return rideRepository.save(r);
                }).orElse(null);
    }

    // ---------------- Update ride status ----------------
    public Ride updateRideStatus(Long rideId, String status) {
        return rideRepository.findById(rideId)
                .map(ride -> {
                    ride.setStatus(status);
                    Ride updatedRide = rideRepository.save(ride);

                    // If completed, add to earnings table
                    if ("Completed".equalsIgnoreCase(status)
                            && updatedRide.getFare() != null
                            && updatedRide.getDriver() != null) {
                        jdbcTemplate.update(
                                "INSERT INTO earnings (driver_id, ride_id, amount, date, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                                updatedRide.getDriver().getId(),
                                updatedRide.getId(),
                                updatedRide.getFare(),
                                LocalDate.now()
                        );
                        logger.info("Earnings updated for driver {}", updatedRide.getDriver().getId());
                    }

                    return updatedRide;
                }).orElse(null);
    }

    // ---------------- Get all rides by driver ----------------
    public List<Ride> getRidesByDriver(Driver driver) {
        return rideRepository.findByDriver(driver);
    }

    // ---------------- Get rides by driver AND status ----------------
    public List<Ride> getRidesByDriverAndStatus(Driver driver, String status) {
        return rideRepository.findByDriverAndStatusIgnoreCase(driver, status);
    }

    // ---------------- Get earnings for a driver from a date ----------------
    public double getEarnings(Driver driver, LocalDate fromDate) {
        return getRidesByDriver(driver).stream()
                .filter(r -> "Completed".equalsIgnoreCase(r.getStatus())
                        && r.getRideTime() != null
                        && !r.getRideTime().toLocalDate().isBefore(fromDate))
                .mapToDouble(Ride::getFare)
                .sum();
    }

    // ---------------- Get current active ride ----------------
    public Ride getActiveRideByDriver(Driver driver) {
        List<Ride> activeRides = rideRepository.findByDriverAndStatusIgnoreCase(driver, "Arriving");
        if (!activeRides.isEmpty()) return activeRides.get(0);

        activeRides = rideRepository.findByDriverAndStatusIgnoreCase(driver, "Ongoing");
        if (!activeRides.isEmpty()) return activeRides.get(0);

        return null;
    }

    // ---------------- Get rides by driver and date range ----------------
    public List<Ride> getCompletedRidesByDriver(Driver driver, LocalDate fromDate) {
        return getRidesByDriver(driver).stream()
                .filter(r -> "Completed".equalsIgnoreCase(r.getStatus())
                        && r.getRideTime() != null
                        && !r.getRideTime().toLocalDate().isBefore(fromDate))
                .toList();
    }
}
