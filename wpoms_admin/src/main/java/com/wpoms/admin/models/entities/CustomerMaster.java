package com.wpoms.admin.models.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "customer_email", unique = true)
    private String customerEmail;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "phone_no", unique = true)
    private String phoneNo;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "contact_preference")
    private String contactPreference;

}
