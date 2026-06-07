package com.wpoms.admin.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wpoms.admin.models.entities.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(int cartId);
    Optional<CartItem> findByCartIdAndProductId(int cartId, int productId);
    List<CartItem> findByCartIdAndCartItemIdIn(int cartId, List<Integer> cartItemIds);
    void deleteByCartId(int cartId);
}
