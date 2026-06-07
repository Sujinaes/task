package com.wpoms.admin.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductWarrantyTypeResponse {
    private int warrantyTypeId;
    private String warrantyType;
}
