package com.ridesharing.ridesharing.controller;

import com.ridesharing.ridesharing.entity.User;
import com.ridesharing.ridesharing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public User getProfile(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = userService.extractEmailFromToken(token);
        Optional<User> user = userService.getUserByEmail(email);
        return user.orElseThrow(() -> new RuntimeException("User not found"));
    }
}
