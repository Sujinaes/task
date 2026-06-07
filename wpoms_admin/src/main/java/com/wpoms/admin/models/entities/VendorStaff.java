package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vendor_staff")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "s_id")
    private int sId;

    @Column(name = "s_name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "department")
    private String department;

    @Column(name = "vendor_id")
    private int vendorId;

    @Column(name = "user_id")
    private Long userId;
}