package com.wpoms.admin.models.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorOrderListResponse {
    private List<VendorOrderSummary> orders;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VendorOrderSummary {
        private String poNumber;
        private String manufacturer;
        private LocalDate orderDate;
        private String status;
        private LocalDate deliveryDate;
        private double totalAmount;
    }
}
