package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceOrderResponse {
    private String message;
    private String poNumber;
    private String manufacturer;
    private String status;
    private double totalAmount;
}
