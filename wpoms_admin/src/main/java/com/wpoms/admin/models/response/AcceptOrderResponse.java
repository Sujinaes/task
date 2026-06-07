package com.wpoms.admin.models.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AcceptOrderResponse {
    private String message;
    private String status;
    private LocalDate deliveryDate;
}
