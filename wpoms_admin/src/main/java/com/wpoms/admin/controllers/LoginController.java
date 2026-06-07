package com.wpoms.admin.controllers;

import com.wpoms.admin.models.payloads.LoginPayload;
import com.wpoms.admin.models.response.LoginResponse;
import com.wpoms.admin.services.ILoginService;
import com.wpoms.admin.utilities.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class LoginController {

    @Autowired
    ILoginService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginPayload payload) {

        LoginResponse response = service.login(payload);
        if (response.getEmail() != null) {
            // Token generation with both email AND role
            String token = jwtUtil.generateToken(response.getEmail(), response.getRole());
            response.setToken(token);
        }
        return ResponseEntity.ok(response);
    }
}