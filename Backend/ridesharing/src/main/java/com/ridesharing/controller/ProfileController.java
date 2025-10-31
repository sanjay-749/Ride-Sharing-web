package com.ridesharing.controller;

import com.ridesharing.entity.User;
import com.ridesharing.security.JwtUtil;
import com.ridesharing.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public User getProfile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String email = jwtUtil.extractEmail(token);
        return profileService.getProfileByEmail(email);
    }
}
