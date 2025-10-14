package com.ridesharing.ridesharing.controller;

import com.ridesharing.ridesharing.entity.User;
import com.ridesharing.ridesharing.security.JwtUtil;
import com.ridesharing.ridesharing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") // for Vite frontend
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        System.out.println("Controller: /register called");
        User registeredUser = userService.register(user);
        System.out.println("Controller: /register successful -> " + registeredUser.getEmail());
        return registeredUser;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {
        System.out.println("Controller: /login called with email -> " + loginData.get("email"));
        String email = loginData.get("email");
        String password = loginData.get("password");
        User user = userService.login(email, password);
        String token = jwtUtil.generateToken(user.getEmail());
        System.out.println("Controller: /login successful -> " + email);
        return Map.of("token", token, "name", user.getName(), "email", user.getEmail());
    }
}
