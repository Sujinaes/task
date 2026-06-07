package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManufacturerOrderListResponse {
    private List<ManufacturerOrderSummary> orders;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ManufacturerOrderSummary {
        private String poNumber;
        private String vendorName;
        private String orderDate;
        private String status;
        private double totalAmount;
        private LocalDate deliveryDate;
    }
}
