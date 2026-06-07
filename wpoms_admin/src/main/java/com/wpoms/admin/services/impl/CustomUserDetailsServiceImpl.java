package com.wpoms.admin.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.wpoms.admin.models.entities.UserMaster;
import com.wpoms.admin.repositories.UserMasterRepository;
import com.wpoms.admin.services.ICustomUserDetailsService;

@Service
public class CustomUserDetailsServiceImpl implements ICustomUserDetailsService {

    @Autowired
    private UserMasterRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserMaster user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole())
                .build();
    }
}