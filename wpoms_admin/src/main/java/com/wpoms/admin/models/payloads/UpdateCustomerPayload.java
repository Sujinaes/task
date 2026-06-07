package com.wpoms.admin.models.payloads;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateCustomerPayload {
        @NotBlank(message = "Customer name is required")
        private String customerName;

        @Pattern(regexp = "^\\+?[1-9]\\d{10,14}$", message = "Phone must be a valid international number")
        private String phoneNo;

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in past")
        private LocalDate dateOfBirth;

        @NotBlank(message = "Shipping address is required")
        private String shippingAddress;

        @NotBlank(message = "Contact preference is required")
        @Pattern(regexp = "^\\+?[1-9]\\d{10,14}$", message = "Phone must be a valid international number")
        private String contactPreference;

}
