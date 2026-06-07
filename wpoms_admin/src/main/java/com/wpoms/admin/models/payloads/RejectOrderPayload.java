package com.wpoms.admin.models.payloads;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RejectOrderPayload {
    @NotBlank(message = "Reason is required")
    private String reason;
}
