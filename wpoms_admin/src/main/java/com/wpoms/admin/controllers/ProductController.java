package com.wpoms.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wpoms.admin.models.payloads.ProductPayload;
import com.wpoms.admin.models.response.ProductResponse;
import com.wpoms.admin.services.IProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/manufacturer")
@CrossOrigin
public class ProductController {

    @Autowired
    private IProductService productService;

    // CREATE PRODUCT
    @PostMapping("/create-product")
    public ProductResponse createProduct(@Valid @RequestBody ProductPayload payload) {
        return productService.createProduct(payload);
    }

    // GET ALL PRODUCTS
    @GetMapping("/products")
    public List<ProductResponse> getProductsByManufacturerId(@RequestParam int manufacturerId) {
        return productService.getProductsByManufacturerId(manufacturerId);
    }

    // GET SINGLE PRODUCT
    @GetMapping("/product")
    public ProductResponse getProductById(
            @RequestParam int productId,
            @RequestParam int manufacturerId) {
        return productService.getProductById(productId, manufacturerId);
    }

    // UPDATE PRODUCT
    @PutMapping("/update-product")
    public ProductResponse updateProduct(
            @RequestParam int productId,
            @Valid @RequestBody ProductPayload payload) {
        return productService.updateProduct(productId, payload);
    }

    // DELETE PRODUCT (SOFT DELETE)
    @PatchMapping("/delete-product")
    public ProductResponse deleteProduct(
            @RequestParam int productId,
            @RequestParam int manufacturerId) {
        return productService.deleteProduct(productId, manufacturerId);
    }
}