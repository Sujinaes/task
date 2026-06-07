package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "manufacturer_staff")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManufacturerStaff {

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

    @Column(name = "manufacture_id")
    private int manufacturerId;

    @Column(name = "user_id")
    private Long userId;

}