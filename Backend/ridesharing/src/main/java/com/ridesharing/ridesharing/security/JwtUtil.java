package com.ridesharing.ridesharing.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String DEFAULT_BASE64_SECRET = "VGhpcyBpcyBhIHNlY3JldCBrZXkgZm9yIGRldg=="; // "This is a secret key for dev"

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(DEFAULT_BASE64_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ generateToken(email, role)
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role != null ? role : "USER");
        return createToken(claims, email);
    }

    // ✅ keep old one-argument version for existing controllers
    public String generateToken(String email) {
        return generateToken(email, "USER");
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + 1000L * 60 * 60 * 10)) // 10 hrs
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        try {
            Object roleObj = extractAllClaims(token).get("role");
            return roleObj != null ? roleObj.toString() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        Date exp = extractExpiration(token);
        return exp != null && exp.before(new Date());
    }

    // ✅ Original method used in JwtFilter
    public boolean validateToken(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return tokenEmail != null && tokenEmail.equals(email) && !isTokenExpired(token);
    }

    // ✅ NEW overloaded method for ProfileController and older code
    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
