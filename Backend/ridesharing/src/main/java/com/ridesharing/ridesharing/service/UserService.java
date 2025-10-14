package com.ridesharing.ridesharing.service;

import com.ridesharing.ridesharing.entity.User;
import com.ridesharing.ridesharing.repository.UserRepository;
import com.ridesharing.ridesharing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register new user
    public User register(User user) {
        System.out.println("Register request received: " + user.getEmail());
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            System.out.println("Registration failed: Email already exists -> " + user.getEmail());
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        System.out.println("Registration successful: " + savedUser.getEmail());
        return savedUser;
    }

    // ✅ Login and return user if valid
    public User login(String email, String password) {
        System.out.println("Login attempt: " + email);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            System.out.println("Login failed: Email not found -> " + email);
            throw new RuntimeException("Invalid credentials");
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            System.out.println("Login failed: Password mismatch for email -> " + email);
            throw new RuntimeException("Invalid credentials");
        }

        System.out.println("Login successful: " + email);
        return user.get();
    }

    // ✅ Fetch user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ✅ Extract email from token
    public String extractEmailFromToken(String token) {
        return jwtUtil.extractEmail(token);
    }
}
