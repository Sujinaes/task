package com.wpoms.admin.models.entities;

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
@Table(name = "vendors")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendor_id")
    private Integer vendorId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(name = "business_email", unique = true)
    private String businessEmail;

    @Column(name = "address")
    private String address;

    @Column(name = "phone", unique = true)
    private String phone;

    @Column(name = "gst_number", unique = true)
    private String gstNumber;

}
