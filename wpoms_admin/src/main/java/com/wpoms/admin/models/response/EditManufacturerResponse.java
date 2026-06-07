package com.wpoms.admin.models.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditManufacturerResponse {

    private String companyName;
    private String companyEmail;
    private String companyAddress;
    private String phone;
    private String gstNumber;
    private String message;

}
