package com.wpoms.admin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wpoms.admin.models.entities.ManufacturerStaff;

@Repository
public interface ManufacturerStaffRepository extends JpaRepository<ManufacturerStaff, Integer> {

    Optional<ManufacturerStaff> findByUserId(Long userId);

    boolean existsByPhoneAndManufacturerId(String phone, int manufacturerId);

    List<ManufacturerStaff> findByManufacturerId(int manufacturerId);
}