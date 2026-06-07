package com.wpoms.admin.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wpoms.admin.models.entities.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByVendorId(int vendorId);
    List<Order> findByManufacturerId(int manufacturerId);
}
