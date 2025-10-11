package com.ridesharing.ridesharing.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String status; // e.g., pending, in-progress, completed

    @Column(nullable = false)
    private LocalDateTime rideTime;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    // Constructors
    public Ride() {}

    public Ride(String origin, String destination, String status, LocalDateTime rideTime, Driver driver) {
        this.origin = origin;
        this.destination = destination;
        this.status = status;
        this.rideTime = rideTime;
        this.driver = driver;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRideTime() { return rideTime; }
    public void setRideTime(LocalDateTime rideTime) { this.rideTime = rideTime; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }
}
