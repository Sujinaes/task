package com.wpoms.admin.utilities.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // ========== SKIP FILTER FOR PUBLIC PATHS ==========
        if (shouldSkipFilter(path)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "No Bearer token");
            return;
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);

        if (email == null || role == null || !jwtUtil.validateToken(token, email)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid or expired token");
            return;
        }

        System.out.println("=== JWT DEBUG ===");
        System.out.println("Path: " + path);
        System.out.println("Email: " + email);
        System.out.println("Role from token: " + role);
        System.out.println("=================");

        if (email != null && role != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // Create authentication with role from token
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));

            SecurityContextHolder.getContext().setAuthentication(authToken);
            System.out.println("Authentication set with ROLE_" + role);
        } else {
            System.out.println("Failed to set authentication - email or role is null");
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid token - missing role");
            return;
        }

        chain.doFilter(request, response);
    }

    // Public Paths
    private boolean shouldSkipFilter(String path) {
        return path.equals("/api/login") ||
                path.equals("/api/admin/register-manufacturer") ||
                path.equals("/api/customer/register-customer") ||
                path.equals("/api/vendor/register") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs") ||
                path.equals("/swagger-ui.html") ||
                path.startsWith("/swagger-resources") ||
                path.equals("/api/products/warranty-types") ||
                path.equals("/api/products/categories") ||
                path.startsWith("/webjars");
    }
}