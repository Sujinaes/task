package com.wpoms.admin.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;


@Entity
@Table(name = "cart_item")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartitem_id")
    private int cartItemId;


    @Column(name = "cart_id")
    private int cartId;


    @Column(name = "product_id")
    private int productId;


    @Column(name = "quantity")
    private int quantity;


    @Column(name = "added_at")
    private LocalDateTime addedAt;
}


