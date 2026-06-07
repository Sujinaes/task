package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private String message;
    private Long userId;
    private String email;
    private String role;
    private String token; 
    private Long roleId;
    
}
