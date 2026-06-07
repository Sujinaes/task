package com.wpoms.admin.models.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {

    private int productId;
    private String productName;
    private String category;
    private Double price;
    private String warrantyType;
    private String description;
    private int manufacturerId;
    private String manufacturerName;
    private Integer stockQuantity;
    private Boolean isActive;
    private String message;

}
