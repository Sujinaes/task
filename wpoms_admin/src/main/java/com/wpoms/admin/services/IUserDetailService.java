package com.wpoms.admin.services;

import org.springframework.security.core.userdetails.UserDetails;

public interface IUserDetailService {

    UserDetails loadUserByEmail(String email);
}