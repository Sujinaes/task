package com.wpoms.admin.models.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCartPayload {
    private Integer cartItemId;
    private Integer quantity;

}
