package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_warranty_type")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductWarrantyType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warranty_type_id")
    private int warrantyTypeId;

    @Column(name = "warranty_type", unique = true, nullable = false)
    private String warrantyType;
}
