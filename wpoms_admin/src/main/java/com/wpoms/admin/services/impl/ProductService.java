package com.wpoms.admin.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpoms.admin.models.entities.ManufacturerMaster;
import com.wpoms.admin.models.entities.Product;
import com.wpoms.admin.models.payloads.ProductPayload;
import com.wpoms.admin.models.response.ProductResponse;
import com.wpoms.admin.repositories.ManufacturerMasterRepository;
import com.wpoms.admin.repositories.ProductCategoryRepository;
import com.wpoms.admin.repositories.ProductRepository;
import com.wpoms.admin.repositories.ProductWarrantyTypeRepository;
import com.wpoms.admin.services.IProductService;

@Service
public class ProductService implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ManufacturerMasterRepository manufacturerMasterRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ProductWarrantyTypeRepository warrantyTypeRepository;

    // ========== 1. CREATE PRODUCT ==========
    @Override
    public ProductResponse createProduct(ProductPayload payload) {

        // validate warranty type and category
        validateCategoryAndWarrantyType(payload);

        // Check if manufacturer exists
        if (!manufacturerMasterRepository.existsByManufacturerId(payload.getManufacturerId().intValue())) {
            throw new RuntimeException("Manufacturer not found with ID: " + payload.getManufacturerId());
        }

        // Check if product already exists for this manufacturer
        if (productRepository.existsByProductNameAndManufacturerId(
                payload.getProductName(),
                payload.getManufacturerId().intValue())) {
            throw new RuntimeException("Product " + payload.getProductName() + " already exists for this manufacturer");
        }

        // Create new product
        Product product = new Product();
        product.setProductName(payload.getProductName());
        product.setCategory(payload.getCategory());
        product.setPrice(payload.getPrice());
        product.setWarrantyType(payload.getWarrantyType());
        product.setDescription(payload.getDescription());
        product.setStockQuantity(payload.getStockQuantity());
        product.setActive(true);

        product.setManufacturerId(payload.getManufacturerId().intValue());

        // SAVE the product
        Product savedProduct = productRepository.save(product);

        // Prepare response
        ProductResponse response = new ProductResponse();
        response.setProductId(savedProduct.getProductId());
        response.setProductName(savedProduct.getProductName());
        response.setCategory(savedProduct.getCategory());
        response.setPrice(savedProduct.getPrice());
        response.setWarrantyType(savedProduct.getWarrantyType());
        response.setDescription(savedProduct.getDescription());
        response.setManufacturerId(savedProduct.getManufacturerId());
        response.setStockQuantity(savedProduct.getStockQuantity());
        response.setIsActive(savedProduct.isActive());
        ManufacturerMaster manufacturer = manufacturerMasterRepository
                .findById(savedProduct.getManufacturerId()).orElse(null);
        if (manufacturer != null) {
            response.setManufacturerName(manufacturer.getCompanyName());
        }

        response.setMessage("Product created successfully");

        return response;
    }

    // ========== 2. GET ALL PRODUCTS BY MANUFACTURER ==========
    @Override
    public List<ProductResponse> getProductsByManufacturerId(int manufacturerId) {

        // Check if manufacturer exists
        if (!manufacturerMasterRepository.existsByManufacturerId(manufacturerId)) {
            throw new RuntimeException("Manufacturer not found with ID: " + manufacturerId);
        }

        // Get all products
        List<Product> products = productRepository.findByManufacturerId(manufacturerId);

        // Convert to response list
        return products.stream().map(product -> {
            ProductResponse response = new ProductResponse();
            response.setProductId(product.getProductId());
            response.setProductName(product.getProductName());
            response.setCategory(product.getCategory());
            response.setPrice(product.getPrice());
            response.setWarrantyType(product.getWarrantyType());
            response.setDescription(product.getDescription());
            response.setManufacturerId(product.getManufacturerId());
            response.setStockQuantity(product.getStockQuantity());
            response.setIsActive(product.isActive());

            return response;

        }).collect(Collectors.toList());
    }

    // ========== 3. GET SINGLE PRODUCT BY ID ==========
    @Override
    public ProductResponse getProductById(int productId, int manufacturerId) {

        // Check if manufacturer exists
        if (!manufacturerMasterRepository.existsByManufacturerId(manufacturerId)) {
            throw new RuntimeException("Manufacturer not found with ID: " + manufacturerId);
        }

        // Find product (FIXED: use correct repository method)
        Product product = productRepository.findByProductIdAndManufacturerId(productId, manufacturerId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Prepare response
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setCategory(product.getCategory());
        response.setPrice(product.getPrice());
        response.setWarrantyType(product.getWarrantyType());
        response.setDescription(product.getDescription());
        response.setManufacturerId(product.getManufacturerId());
        response.setStockQuantity(product.getStockQuantity());
        response.setIsActive(product.isActive());

        return response;
    }

    // ========== 4. UPDATE PRODUCT ==========
    @Override
    public ProductResponse updateProduct(int productId, ProductPayload payload) {

        // validate warranty type and category
        validateCategoryAndWarrantyType(payload);

        // Find product by ID and manufacturer ID
        Product product = productRepository
                .findByProductIdAndManufacturerId(productId, payload.getManufacturerId().intValue())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // CHECK IF ANYTHING CHANGED
        boolean isSame = product.getProductName().equals(payload.getProductName()) &&
                product.getCategory().equals(payload.getCategory()) &&
                product.getPrice() == payload.getPrice() &&
                product.getWarrantyType().equals(payload.getWarrantyType()) &&
                product.getDescription().equals(payload.getDescription()) &&
                product.getStockQuantity() == payload.getStockQuantity() &&
                product.isActive() == payload.isActive();

        if (isSame) {
            throw new RuntimeException("No changes detected");
        }

        // Update fields
        product.setProductName(payload.getProductName());
        product.setCategory(payload.getCategory());
        product.setPrice(payload.getPrice());
        product.setWarrantyType(payload.getWarrantyType());
        product.setDescription(payload.getDescription());
        product.setActive(payload.isActive());

        // SAVE the updated product
        Product updatedProduct = productRepository.save(product);

        // Prepare response
        ProductResponse response = new ProductResponse();
        response.setProductId(updatedProduct.getProductId());
        response.setProductName(updatedProduct.getProductName());
        response.setCategory(updatedProduct.getCategory());
        response.setPrice(updatedProduct.getPrice());
        response.setWarrantyType(updatedProduct.getWarrantyType());
        response.setDescription(updatedProduct.getDescription());
        response.setManufacturerId(updatedProduct.getManufacturerId());
        response.setStockQuantity(updatedProduct.getStockQuantity());
        response.setIsActive(updatedProduct.isActive());

        ManufacturerMaster manufacturer = manufacturerMasterRepository
                .findById(updatedProduct.getManufacturerId()).orElse(null);
        if (manufacturer != null) {
            response.setManufacturerName(manufacturer.getCompanyName()); //
        }
        response.setMessage("Product updated successfully");

        return response;
    }

    // ========== 5. DELETE PRODUCT (SOFT DELETE) ==========
    @Override
    public ProductResponse deleteProduct(int productId, int manufacturerId) {
        // Find product by ID and manufacturer ID
        Product product = productRepository
                .findByProductIdAndManufacturerId(productId, manufacturerId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Toggle active field
        product.setActive(!product.isActive());

        // SAVE the updated product
        Product updatedProduct = productRepository.save(product);

        // Prepare response
        ProductResponse response = new ProductResponse();
        response.setProductId(updatedProduct.getProductId());
        response.setProductName(updatedProduct.getProductName());
        response.setCategory(updatedProduct.getCategory());
        response.setPrice(updatedProduct.getPrice());
        response.setWarrantyType(updatedProduct.getWarrantyType());
        response.setDescription(updatedProduct.getDescription());
        response.setManufacturerId(updatedProduct.getManufacturerId());
        response.setIsActive(updatedProduct.isActive());
        response.setMessage(
                updatedProduct.isActive() ? "Product activated successfully" : "Product soft deleted successfully");

        return response;
    }

    // ========== 6. GET VENDOR PRODUCTS (ACTIVE ONLY, WITH FILTERS) ==========
    @Override
    public List<ProductResponse> getVendorProducts(String category, String warrantyType, Double minPrice,
            Double maxPrice,
            String productName, String manufacturerName) {
        // Get active products matching filters
        List<Product> products = productRepository.findVendorProducts(category, warrantyType, minPrice, maxPrice,
                productName,
                manufacturerName);
        if (products.isEmpty()) {
            throw new RuntimeException("No matching products");
        }

        // Convert to response list
        return products.stream().map(product -> {
            ProductResponse response = new ProductResponse();
            response.setProductId(product.getProductId());
            response.setProductName(product.getProductName());
            response.setCategory(product.getCategory());
            response.setPrice(product.getPrice());
            response.setWarrantyType(product.getWarrantyType());
            response.setDescription(product.getDescription());
            response.setManufacturerId(product.getManufacturerId());

            // Optionally fetch manufacturer name if needed, but keeping it consistent with
            // other methods
            ManufacturerMaster manufacturer = manufacturerMasterRepository.findById(product.getManufacturerId())
                    .orElse(null);
            if (manufacturer != null) {
                response.setManufacturerName(manufacturer.getCompanyName());
            }
            response.setStockQuantity(product.getStockQuantity());
            response.setIsActive(product.isActive());

            return response;
        }).collect(Collectors.toList());
    }

    private void validateCategoryAndWarrantyType(ProductPayload payload) {
        if (!categoryRepository.existsByCategoryNameIgnoreCase(payload.getCategory())) {
            throw new RuntimeException("Category not found with name: " + payload.getCategory());
        }

        if (!warrantyTypeRepository.existsByWarrantyTypeIgnoreCase(payload.getWarrantyType())) {
            throw new RuntimeException("Warranty type not found with name: " + payload.getWarrantyType());
        }
    }
}