package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartResponse {
    private String message;
    private CartItemInfo cartItem;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartItemInfo {
        private int cartItemId;
        private int productId;
        private String productName;
        private int quantity;
        private double price;
        private double subtotal;
    }
}
