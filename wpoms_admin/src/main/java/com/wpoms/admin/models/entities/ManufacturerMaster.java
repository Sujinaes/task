package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "manufacturers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManufacturerMaster {

    @Column(name = "user_id")
    private Long userId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manufacture_id")
    private int manufacturerId;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_email", unique = true)
    private String companyEmail;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "gst_number")
    private String gstNumber;
}
