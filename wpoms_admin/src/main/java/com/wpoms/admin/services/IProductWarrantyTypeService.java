package com.wpoms.admin.services;

import java.util.List;
import com.wpoms.admin.models.response.ProductWarrantyTypeResponse;

public interface IProductWarrantyTypeService {
    List<ProductWarrantyTypeResponse> getAllWarrantyTypes();
}
