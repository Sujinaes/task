package com.wpoms.admin.models.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditVendorResponse {

    private String message;
    private String vendorName;
    private String vendorEmail;
    private String address;
    private String phone;
    private String gstNumber;

}
