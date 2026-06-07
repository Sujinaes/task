package com.wpoms.admin.services.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.wpoms.admin.models.entities.UserMaster;
import com.wpoms.admin.repositories.UserMasterRepository;

import com.wpoms.admin.services.IUserDetailService;

@Service
public class UserDetailsService
        implements org.springframework.security.core.userdetails.UserDetailsService, IUserDetailService {

    @Autowired
    private UserMasterRepository userRepository;

    @Override
    public UserDetails loadUserByEmail(String email) {

        Optional<UserMaster> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        UserMaster user = userOptional.get();

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(user.getRole())
                .build();
    }

    // Spring Security
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return loadUserByEmail(email);
    }
}
