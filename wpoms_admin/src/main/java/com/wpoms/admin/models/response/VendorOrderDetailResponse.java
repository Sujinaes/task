package com.wpoms.admin.models.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorOrderDetailResponse {
    private String poNumber;
    private String manufacturer;
    private String status;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private List<OrderItemDetail> items;
    private double totalAmount;
    private String reason;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemDetail {
        private int orderItemId;
        private int quantity;
        private double price;
        private double subtotal;
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
