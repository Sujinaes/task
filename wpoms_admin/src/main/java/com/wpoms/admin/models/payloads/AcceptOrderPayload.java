package com.wpoms.admin.models.payloads;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AcceptOrderPayload {

    @NotNull(message = "Delivery date is required")
    @Future(message = "Delivery date must be in the future")
    private LocalDate deliveryDate;
}
