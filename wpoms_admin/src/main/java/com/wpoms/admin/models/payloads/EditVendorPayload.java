package com.wpoms.admin.models.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditVendorPayload {

        @NotBlank(message = "Vendor name is required")
        private String vendorName;

        @NotBlank(message = "Email is required")
        @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "Vendor email must be valid")
        private String vendorEmail;

        @NotBlank(message = "Address is required")
        private String address;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[1-9]\\d{10,14}$", message = "Phone must be a valid international number")
        private String phone;

        @NotBlank(message = "Gst number is required")
        @Size(min = 15, max = 15, message = "GST number should contain 15 digits")
        @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", message = "Invalid GST number format")
        private String gstNumber;

}
