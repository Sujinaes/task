package com.wpoms.admin.services;

import java.util.List;
import com.wpoms.admin.models.response.ProductCategoryResponse;

public interface IProductCategoryService {
    List<ProductCategoryResponse> getAllCategories();
}
