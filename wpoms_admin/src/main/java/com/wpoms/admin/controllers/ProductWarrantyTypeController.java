package com.wpoms.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wpoms.admin.models.response.ProductWarrantyTypeResponse;
import com.wpoms.admin.services.IProductWarrantyTypeService;

@RestController
@RequestMapping("/api/products/warranty-types")
@CrossOrigin
public class ProductWarrantyTypeController {

    @Autowired
    private IProductWarrantyTypeService warrantyTypeService;

    @GetMapping
    public List<ProductWarrantyTypeResponse> getAllWarrantyTypes() {
        return warrantyTypeService.getAllWarrantyTypes();
    }
}
