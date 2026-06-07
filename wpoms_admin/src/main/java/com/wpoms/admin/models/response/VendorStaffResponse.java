package com.wpoms.admin.models.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VendorStaffResponse {
    private int sId;
    private String name;
    private String phone;
    private String department;
    private int vendorId;
    private Long userId;
    private String email;
    private String message;
}