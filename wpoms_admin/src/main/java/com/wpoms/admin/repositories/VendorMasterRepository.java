package com.wpoms.admin.repositories;

import com.wpoms.admin.models.entities.VendorMaster;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorMasterRepository extends JpaRepository<VendorMaster, Integer> {

    boolean existsByGstNumber(String gstNumber);

    Optional<VendorMaster> findByUserId(Integer id);

    boolean existsByBusinessEmail(String vendorEmail);

    boolean existsByPhone(String phone);

    boolean existsByBusinessEmailAndUserIdNot(String vendorEmail, Integer id);

    boolean existsByGstNumberAndUserIdNot(String gstNumber, Integer id);

    boolean existsByPhoneAndUserIdNot(String phone, Integer id);

    boolean existsByVendorId(int vendorId);

    Optional<VendorMaster> findByVendorId(int vendorId);
}
