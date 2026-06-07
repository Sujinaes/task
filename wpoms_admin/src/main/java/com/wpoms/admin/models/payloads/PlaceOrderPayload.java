package com.wpoms.admin.models.payloads;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceOrderPayload {

    @NotNull(message = "Cart item IDs are required")
    private List<Integer> cartItemIds;

    @NotNull(message = "Vendor name is required")
    private String vendorName;

    @NotNull(message = "Address is required")
    private String address;

    @NotNull(message = "Location is required")
    private String location;

}
