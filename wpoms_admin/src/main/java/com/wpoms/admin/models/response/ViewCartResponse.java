package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewCartResponse {
    private Integer cartId;
    private List<CartItemDetail> items;
    private Double totalAmount;
    private String message;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CartItemDetail {
        private int cartItemId;
        private int productId;
        private String productName;
        private String manufacturer;
        private double price;
        private int quantity;
        private double subtotal;
        private String Message;
    }
}
