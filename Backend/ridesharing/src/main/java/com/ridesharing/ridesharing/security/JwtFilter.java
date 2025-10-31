package com.ridesharing.ridesharing.security;

import com.ridesharing.ridesharing.entity.Driver;
import com.ridesharing.ridesharing.entity.User;
import com.ridesharing.ridesharing.repository.DriverRepository;
import com.ridesharing.ridesharing.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // Repositories from your project (may return Optional<T> or T depending on your code)
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
            } catch (Exception ex) {
                // if token invalid parsing/expired, we let it be unauthenticated
                email = null;
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String role = jwtUtil.extractRole(token);
            UserDetails userDetails = null;

            // ---- Try to load User (two repository signatures supported) ----
            try {
                // assign result to Object so both Optional<User> and User compile.
                Object userResult = userRepository.findByEmail(email);
                if (userResult != null) {
                    if (userResult instanceof Optional) {
                        Optional<?> opt = (Optional<?>) userResult;
                        if (opt.isPresent() && opt.get() instanceof User) {
                            User user = (User) opt.get();
                            userDetails = org.springframework.security.core.userdetails.User
                                    .withUsername(user.getEmail())
                                    .password(user.getPassword())
                                    .roles("USER")
                                    .build();
                        }
                    } else if (userResult instanceof User) {
                        User user = (User) userResult;
                        userDetails = org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .roles("USER")
                                .build();
                    }
                }
            } catch (NoSuchMethodError | NoClassDefFoundError | AbstractMethodError ignored) {
                // If method signature differs in runtime, ignore and continue (we'll try driver next)
            } catch (Throwable ignored) {
                // ignore repository loading exceptions here; treat as not found
            }

            // ---- Try to load Driver (two repository signatures supported) ----
            if (userDetails == null) {
                try {
                    Object driverResult = driverRepository.findByEmail(email);
                    if (driverResult != null) {
                        if (driverResult instanceof Optional) {
                            Optional<?> opt = (Optional<?>) driverResult;
                            if (opt.isPresent() && opt.get() instanceof Driver) {
                                Driver driver = (Driver) opt.get();
                                userDetails = org.springframework.security.core.userdetails.User
                                        .withUsername(driver.getEmail())
                                        .password(driver.getPassword())
                                        .roles("DRIVER")
                                        .build();
                            }
                        } else if (driverResult instanceof Driver) {
                            Driver driver = (Driver) driverResult;
                            userDetails = org.springframework.security.core.userdetails.User
                                    .withUsername(driver.getEmail())
                                    .password(driver.getPassword())
                                    .roles("DRIVER")
                                    .build();
                        }
                    }
                } catch (NoSuchMethodError | NoClassDefFoundError | AbstractMethodError ignored) {
                } catch (Throwable ignored) {
                }
            }

            // ---- If we found userDetails and token is valid, set authentication ----
            if (userDetails != null && jwtUtil.validateToken(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}
