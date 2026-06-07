package com.wpoms.admin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wpoms.admin.models.entities.ManufacturerMaster;

@Repository
public interface ManufacturerMasterRepository extends JpaRepository<ManufacturerMaster, Integer> {

    boolean existsByCompanyEmail(String companyEmail);

    boolean existsByGstNumber(String gstNumber);

    boolean existsByPhone(String phone);

    Optional<ManufacturerMaster> findByUserId(int id);

    boolean existsByCompanyEmailAndUserIdNot(String companyEmail, int id);

    boolean existsByGstNumberAndUserIdNot(String gstNumber, int id);

    boolean existsByPhoneAndUserIdNot(String companyPhone, int id);

    boolean existsByManufacturerId(int manufacturerId);
}
