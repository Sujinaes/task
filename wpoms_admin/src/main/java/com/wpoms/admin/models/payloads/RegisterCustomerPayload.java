package com.wpoms.admin.models.payloads;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCustomerPayload {

        @NotBlank(message = "Email is required")
        @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "Customer email must be valid")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be alteast  8 characters ")
        private String passwordHash;

        @NotBlank(message = "Role is required")
        private String role;

        @NotBlank(message = "Customer name is required")
        private String customerName;

        @Pattern(regexp = "^\\+?[1-9]\\d{10,14}$", message = "Phone must be a valid international number")
        private String phoneNo;

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in  the past")
        private LocalDate dateOfBirth;

        @NotBlank(message = "Shipping address is required")
        private String shippingAddress;

        @NotBlank(message = "Contact Preference is required ")
        @Pattern(regexp = "^\\+?[1-9]\\d{10,14}$", message = "Phone must be a valid international number")
        private String contactPreference;
}
