package com.wpoms.admin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wpoms.admin.models.entities.VendorStaff;

public interface VendorStaffRepository extends JpaRepository<VendorStaff, Integer> {

    Optional<VendorStaff> findByUserId(Long userId);

    boolean existsByPhoneAndVendorId(String phone, int vendorId);

    List<VendorStaff> findByVendorId(int vendorId);

}