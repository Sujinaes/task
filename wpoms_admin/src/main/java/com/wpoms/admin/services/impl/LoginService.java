package com.wpoms.admin.services.impl;

import com.wpoms.admin.models.entities.UserMaster;
import com.wpoms.admin.models.payloads.LoginPayload;
import com.wpoms.admin.models.response.LoginResponse;
import com.wpoms.admin.repositories.CustomerRepository;
import com.wpoms.admin.repositories.ManufacturerMasterRepository;
import com.wpoms.admin.repositories.UserMasterRepository;
import com.wpoms.admin.repositories.VendorMasterRepository;
import com.wpoms.admin.services.ILoginService;
import com.wpoms.admin.utilities.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class LoginService implements ILoginService {

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    UserMasterRepository userRepository;

    @Autowired
    ManufacturerMasterRepository manufacturerMasterRepository;

    @Autowired
    VendorMasterRepository vendorMasterRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginPayload payload) {

        UserMaster user = userRepository.findByEmail(payload.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (!bCryptPasswordEncoder.matches(payload.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // Get roleId based on role
        Long roleId = null;
        String role = user.getRole().toUpperCase();
        
        switch (role) {
            case "MANUFACTURER":
                roleId = manufacturerMasterRepository.findByUserId(user.getId().intValue())
                        .map(manufacturer -> (long) manufacturer.getManufacturerId())
                        .orElse(null);
                break;
                
            case "VENDOR":
                roleId = vendorMasterRepository.findByUserId(user.getId().intValue())
                        .map(vendor -> (long) vendor.getVendorId())
                        .orElse(null);
                break;
                
            case "CUSTOMER":
                roleId = customerRepository.findByUserId(user.getId().intValue())
                        .map(customer -> (long) customer.getCustomerId())
                        .orElse(null);
                break;
        }

        LoginResponse response = new LoginResponse();
        response.setMessage("Login successful");
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken(token);
        response.setRoleId(roleId);

        return response;
    }
}