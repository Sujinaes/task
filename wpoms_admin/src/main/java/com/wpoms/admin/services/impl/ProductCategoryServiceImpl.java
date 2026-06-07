package com.wpoms.admin.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpoms.admin.models.entities.ProductCategory;
import com.wpoms.admin.models.response.ProductCategoryResponse;
import com.wpoms.admin.repositories.ProductCategoryRepository;
import com.wpoms.admin.services.IProductCategoryService;

@Service
public class ProductCategoryServiceImpl implements IProductCategoryService {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Override
    public List<ProductCategoryResponse> getAllCategories() {
        List<ProductCategory> categories = categoryRepository.findAll();
        return categories.stream()
                .map(cat -> new ProductCategoryResponse(cat.getCategoryId(), cat.getCategoryName()))
                .collect(Collectors.toList());
    }
}
