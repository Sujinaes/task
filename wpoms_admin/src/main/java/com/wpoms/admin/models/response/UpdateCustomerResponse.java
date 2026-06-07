package com.wpoms.admin.models.response;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateCustomerResponse {

    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String phoneNo;
    private LocalDate dateOfBirth;
    private String shippingAddress;
    private String contactPreference;
    private String message;

}
