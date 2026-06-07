package com.wpoms.admin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wpoms.admin.models.entities.ProductWarrantyType;

@Repository
public interface ProductWarrantyTypeRepository extends JpaRepository<ProductWarrantyType, Integer> {
    boolean existsByWarrantyTypeIgnoreCase(String warrantyType);
}
