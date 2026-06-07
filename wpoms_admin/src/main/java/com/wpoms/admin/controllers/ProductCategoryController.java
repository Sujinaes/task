package com.wpoms.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wpoms.admin.models.response.ProductCategoryResponse;
import com.wpoms.admin.services.IProductCategoryService;

@RestController
@RequestMapping("/api/products/categories")
@CrossOrigin
public class ProductCategoryController {

    @Autowired
    private IProductCategoryService categoryService;

    @GetMapping
    public List<ProductCategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }
}
