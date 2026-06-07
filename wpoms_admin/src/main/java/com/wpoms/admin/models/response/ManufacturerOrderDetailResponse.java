package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManufacturerOrderDetailResponse {
    private String poNumber;
    private String vendorName;
    private String status;
    private List<ManufacturerOrderItemDetail> items;
    private double totalAmount;
    private String reason;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ManufacturerOrderItemDetail {
        private int orderItemId;
        private int quantity;
        private ProductInfo product;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductInfo {
        private int productId;
        private String productName;
        private String category;
        private String description;
        private String warrantyType;
        private int manufacturerId;
        private double price;
    }
}
