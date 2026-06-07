package com.wpoms.admin.models.payloads;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPayload {
    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.0", message = "Price must be greater than 0")
    @DecimalMax(value = "10000000.0", message = "Price cannot exceed 1 crore")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotBlank(message = "Warranty type is required")
    private String warrantyType;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Manufacturer ID is required")
    private Long manufacturerId;

    @NotNull(message = "Stock quantity  is required")
    @Min(value = 1, message = "Stock quantity must be greater than 0")
    private Integer stockQuantity;

    @NotNull(message = "required")
    private boolean isActive;

}
