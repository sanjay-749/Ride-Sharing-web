package com.ridesharing.service;

import com.ridesharing.entity.User;
import com.ridesharing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideService rideService;

    public User getProfileByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public int getUserRideCount(Long userId) {
        return rideService.getRidesByUserId(userId).size();
    }

    public int getCompletedRideCount(Long userId) {
        return rideService.getCompletedRidesByUserId(userId).size();
    }

    public int getCancelledRideCount(Long userId) {
        return rideService.getRidesByUserIdAndStatus(userId, "cancelled").size();
    }

    public String getMemberSince(LocalDateTime joinDate) {
        if (joinDate == null) return "Recently";
        
        long months = ChronoUnit.MONTHS.between(joinDate, LocalDateTime.now());
        if (months == 0) {
            long days = ChronoUnit.DAYS.between(joinDate, LocalDateTime.now());
            return days + " day" + (days != 1 ? "s" : "");
        }
        return months + " month" + (months != 1 ? "s" : "");
    }
}