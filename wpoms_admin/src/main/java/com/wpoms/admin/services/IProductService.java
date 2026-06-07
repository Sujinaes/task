package com.wpoms.admin.services;

import java.util.List;

import com.wpoms.admin.models.payloads.ProductPayload;
import com.wpoms.admin.models.response.ProductResponse;

public interface IProductService {

    // Create new product
    ProductResponse createProduct(ProductPayload payload);

    // Get all products by manufacturer ID
    List<ProductResponse> getProductsByManufacturerId(int manufacturerId);

    // Get single product by ID
    ProductResponse getProductById(int productId, int manufacturerId);

    // Update product
    ProductResponse updateProduct(int productId, ProductPayload payload);

    // Delete product (Soft delete by toggling isActive)
    ProductResponse deleteProduct(int productId, int manufacturerId);

    // Get all vendor products with optional filters (active only)
    List<ProductResponse> getVendorProducts(String category, String warrantyType,Double minPrice, Double maxPrice, String productName,String manufacturerName);
}