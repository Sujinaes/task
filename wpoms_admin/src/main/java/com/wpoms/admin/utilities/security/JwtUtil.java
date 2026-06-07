package com.wpoms.admin.utilities.security;

import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final SecretKey key = Keys.hmacShaKeyFor(
            "my-super-secret-key-that-is-at-least-32-bytes!".getBytes());

    // Generate token with email AND role
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role.toUpperCase())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 6))
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Method to extract role from token
    public String extractRole(String token) {
        try {
            return getClaims(token).get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token, String email) {
        try {
            return extractEmail(token).equals(email) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
}