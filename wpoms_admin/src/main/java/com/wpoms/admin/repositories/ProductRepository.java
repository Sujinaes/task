package com.wpoms.admin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wpoms.admin.models.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

       // Find products by manufacturer ID
       List<Product> findByManufacturerId(int manufacturerId);

       // Check if product exists for a manufacturer
       boolean existsByProductNameAndManufacturerId(String productName, int manufacturerId);

       // Find product by ID and manufacturer ID
       Optional<Product> findByProductIdAndManufacturerId(int productId, int manufacturerId);

       @Query(value = """
                     SELECT p.* FROM products p
                     JOIN manufacturers m ON p.manufacturer_id = m.manufacture_id
                     WHERE p.is_active = true
                     AND (:category IS NULL OR p.category = :category)
                     AND (:warrantyType IS NULL OR p.warranty_type = :warrantyType)
                     AND (:minPrice IS NULL OR p.price >= :minPrice)
                     AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                     AND (:productName IS NULL OR p.product_name ILIKE CONCAT('%', :productName, '%'))
                     AND (:manufacturerName IS NULL OR m.company_name ILIKE CONCAT('%', :manufacturerName, '%'))
                     """, nativeQuery = true)
       List<Product> findVendorProducts(
                     @Param("category") String category,
                     @Param("warrantyType") String warrantyType,
                     @Param("minPrice") Double minPrice,
                     @Param("maxPrice") Double maxPrice,
                     @Param("productName") String productName,
                     @Param("manufacturerName") String manufacturerName);

}