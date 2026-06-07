package com.wpoms.admin.controllers;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wpoms.admin.models.response.ProductResponse;
import com.wpoms.admin.services.IProductService;

@RestController
@RequestMapping("/api/vendor")
@CrossOrigin
public class VendorProductController {

    @Autowired
    private IProductService productService;

    // GET ALL PRODUCTS WITH FILTERS (VENDOR)
    @GetMapping("/all-products")
    public List<ProductResponse> getVendorProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String warrantyType,
            @RequestParam(required = false) Double minPrice,   
            @RequestParam(required = false) Double maxPrice,
            
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String manufacturerName) {
        return productService.getVendorProducts(category, warrantyType, minPrice,maxPrice, productName, manufacturerName);
    }

}