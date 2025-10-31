package com.ridesharing.ridesharing.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ridesharing.ridesharing.entity.Driver;
import com.ridesharing.ridesharing.entity.Rider;
import com.ridesharing.ridesharing.repository.RiderRepository;

@Service
public class RiderService {

    private final RiderRepository riderRepository;
    private final JdbcTemplate jdbcTemplate;
    private static final Logger logger = LoggerFactory.getLogger(RiderService.class);

    public RiderService(RiderRepository riderRepository, JdbcTemplate jdbcTemplate) {
        this.riderRepository = riderRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Rider> getPendingRides() {
        return riderRepository.findByStatusIgnoreCase("pending");
    }

    @Transactional
    public Rider acceptRide(Long rideId, Driver driver) {
        return riderRepository.findById(rideId)
                .filter(r -> "pending".equalsIgnoreCase(r.getStatus()) && r.getDriver() == null)
                .map(r -> {
                    r.setDriver(driver);
                    r.setStatus("Arriving");
                    r.setRideTime(LocalDateTime.now());
                    return riderRepository.save(r);
                }).orElse(null);
    }

    public Rider updateRideStatus(Long rideId, String status) {
        return riderRepository.findById(rideId)
                .map(ride -> {
                    ride.setStatus(status);
                    Rider updatedRide = riderRepository.save(ride);

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

    public List<Rider> getRidesByDriver(Driver driver) {
        return riderRepository.findByDriver(driver);
    }

    public List<Rider> getRidesByDriverAndStatus(Driver driver, String status) {
        return riderRepository.findByDriverAndStatusIgnoreCase(driver, status);
    }

    public double getEarnings(Driver driver, LocalDate fromDate) {
        return getRidesByDriver(driver).stream()
                .filter(r -> "Completed".equalsIgnoreCase(r.getStatus())
                        && r.getRideTime() != null
                        && !r.getRideTime().toLocalDate().isBefore(fromDate))
                .mapToDouble(Rider::getFare)
                .sum();
    }

    public Rider getActiveRideByDriver(Driver driver) {
        List<Rider> activeRides = riderRepository.findByDriverAndStatusIgnoreCase(driver, "Arriving");
        if (!activeRides.isEmpty()) return activeRides.get(0);

        activeRides = riderRepository.findByDriverAndStatusIgnoreCase(driver, "Ongoing");
        if (!activeRides.isEmpty()) return activeRides.get(0);

        return null;
    }
}
