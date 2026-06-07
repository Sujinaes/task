package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "\"order\"")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "po_number", unique = true)
    private String poNumber;

    @Column(name = "vendor_id")
    private int vendorId;

    @Column(name = "manufacturer_id")
    private int manufacturerId;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "status")
    private String status;

    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "reason")
    private String reason;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name =  "location")
    private String location;
}
