package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Integer cartItemId;
    private Integer productId;
    private String productName;
    private Integer quantity;
    private float price;
    private double subTotal;
    private String message;

}
