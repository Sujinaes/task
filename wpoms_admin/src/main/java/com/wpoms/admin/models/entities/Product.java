package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private int productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private double price;

    @Column(name = "warranty_type")
    private String warrantyType;

    @Column(name = "description")
    private String description;

    @Column(name = "manufacturer_id")
    private int manufacturerId;

    @Column(name = "stock_quantity")
    private int stockQuantity;

    @Column(name = "is_active")
    private boolean isActive;
}