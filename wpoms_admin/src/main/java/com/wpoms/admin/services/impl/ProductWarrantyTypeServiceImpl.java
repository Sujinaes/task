package com.wpoms.admin.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpoms.admin.models.entities.ProductWarrantyType;
import com.wpoms.admin.models.response.ProductWarrantyTypeResponse;
import com.wpoms.admin.repositories.ProductWarrantyTypeRepository;
import com.wpoms.admin.services.IProductWarrantyTypeService;

@Service
public class ProductWarrantyTypeServiceImpl implements IProductWarrantyTypeService {

    @Autowired
    private ProductWarrantyTypeRepository warrantyTypeRepository;

    @Override
    public List<ProductWarrantyTypeResponse> getAllWarrantyTypes() {
        List<ProductWarrantyType> types = warrantyTypeRepository.findAll();
        return types.stream()
                .map(type -> new ProductWarrantyTypeResponse(type.getWarrantyTypeId(), type.getWarrantyType()))
                .collect(Collectors.toList());
    }
}
