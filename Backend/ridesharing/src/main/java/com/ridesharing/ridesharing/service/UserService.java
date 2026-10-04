package com.ridesharing.ridesharing.service;

import com.ridesharing.ridesharing.entity.User;
import com.ridesharing.ridesharing.repository.UserRepository;
import com.ridesharing.ridesharing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user.get();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Long getUserIdByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(User::getId).orElse(null);
    }

    public String extractEmailFromToken(String token) {
        return jwtUtil.extractEmail(token);
    }
}
