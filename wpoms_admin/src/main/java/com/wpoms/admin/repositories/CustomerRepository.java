package com.wpoms.admin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wpoms.admin.models.entities.CustomerMaster;

@Repository

public interface CustomerRepository extends JpaRepository<CustomerMaster, Integer> {
    boolean existsByCustomerEmail(String email);

    boolean existsByPhoneNo(String phoneNo);

    Optional<CustomerMaster> findByPhoneNo(String phoneNo);

    Optional<CustomerMaster> findByUserId(Integer id);

    boolean existsByPhoneNoAndUserIdNot(String phoneNo, Integer id);

}
