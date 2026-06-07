package com.wpoms.admin.services.impl;

import com.wpoms.admin.models.entities.Cart;
import com.wpoms.admin.models.entities.CartItem;
import com.wpoms.admin.models.entities.ManufacturerMaster;
import com.wpoms.admin.models.entities.Product;
import com.wpoms.admin.models.payloads.AddToCartPayload;
import com.wpoms.admin.models.response.AddToCartResponse;
import com.wpoms.admin.models.response.AddToCartResponse.CartItemInfo;
import com.wpoms.admin.models.response.RemoveCartItemResponse;
import com.wpoms.admin.models.response.ViewCartResponse;
import com.wpoms.admin.models.response.ViewCartResponse.CartItemDetail;
import com.wpoms.admin.repositories.CartItemRepository;
import com.wpoms.admin.repositories.CartRepository;
import com.wpoms.admin.repositories.ManufacturerMasterRepository;
import com.wpoms.admin.repositories.ProductRepository;
import com.wpoms.admin.services.IVendorCartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VendorCartService implements IVendorCartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ManufacturerMasterRepository manufacturerRepository;

    // ========================= ADD TO CART =========================
    @Override
    @Transactional
    public AddToCartResponse addToCart(int vendorId, AddToCartPayload payload) {

        // 1. Get or create cart for vendor
        Cart cart = cartRepository.findByVendorId(vendorId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setVendorId(vendorId);
                    newCart.setCreatedAt(LocalDateTime.now());
                    return cartRepository.save(newCart);
                });

        // 2. Validate product exists
        Product product = productRepository.findById(payload.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 3. Check stock
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductId(cart.getCartId(), payload.getProductId());

        int newQuantity;
        if (existingItem.isPresent()) {
            // Update existing item quantity
            CartItem item = existingItem.get();
            newQuantity = payload.getQuantity();

            if (newQuantity > product.getStockQuantity()) {
                throw new RuntimeException("Insufficient stock available");
            }

            item.setQuantity(newQuantity);
            CartItem savedItem = cartItemRepository.save(item);

            CartItemInfo cartItemInfo = new CartItemInfo();
            cartItemInfo.setCartItemId(savedItem.getCartItemId());
            cartItemInfo.setProductId(product.getProductId());
            cartItemInfo.setQuantity(newQuantity);
            cartItemInfo.setSubtotal(
                    Math.round(product.getPrice() * newQuantity * 100.0) / 100.0);
            cartItemInfo.setPrice(product.getPrice());
            cartItemInfo.setProductName(product.getProductName());
            cartItemInfo.setPrice(product.getPrice());

            AddToCartResponse response = new AddToCartResponse();
            response.setMessage("Cart quantity updated");
            response.setCartItem(cartItemInfo);
            return response;

        } else {
            // Add new item
            newQuantity = payload.getQuantity();

            if (newQuantity > product.getStockQuantity()) {
                throw new RuntimeException("Insufficient stock available");
            }

            CartItem newItem = new CartItem();
            newItem.setCartId(cart.getCartId());
            newItem.setProductId(payload.getProductId());
            newItem.setQuantity(newQuantity);
            newItem.setAddedAt(LocalDateTime.now());

            CartItem savedItem = cartItemRepository.save(newItem);

            CartItemInfo cartItemInfo = new CartItemInfo();
            cartItemInfo.setCartItemId(savedItem.getCartItemId());
            cartItemInfo.setProductId(product.getProductId());
            cartItemInfo.setProductName(product.getProductName());
            cartItemInfo.setQuantity(newQuantity);
            cartItemInfo.setPrice(product.getPrice());
            cartItemInfo.setSubtotal(
                    Math.round(product.getPrice() * newQuantity * 100.0) / 100.0);

            AddToCartResponse response = new AddToCartResponse();
            response.setMessage("Product added to cart");
            response.setCartItem(cartItemInfo);
            return response;
        }
    }

    // ========================= VIEW CART =========================
    @Override
    public ViewCartResponse viewCart(int vendorId) {

        Cart cart = cartRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new RuntimeException("Cart not found for vendor"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getCartId());
        if (cartItems.isEmpty()) {

            ViewCartResponse response = new ViewCartResponse();
            response.setCartId(cart.getCartId());

            response.setMessage("Cart is empty");

            return response;
        }

        List<CartItemDetail> itemDetails = new ArrayList<>();
        double totalAmount = 0;

        for (CartItem item : cartItems) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product == null)
                continue;

            ManufacturerMaster manufacturer = manufacturerRepository
                    .findById(product.getManufacturerId()).orElse(null);

            double subtotal = product.getPrice() * item.getQuantity();

            CartItemDetail detail = new CartItemDetail();
            detail.setCartItemId(item.getCartItemId());
            detail.setProductId(product.getProductId());
            detail.setProductName(product.getProductName());
            detail.setManufacturer(manufacturer != null ? manufacturer.getCompanyName() : "Unknown");
            detail.setPrice(product.getPrice());
            detail.setQuantity(item.getQuantity());
            detail.setSubtotal(subtotal);

            itemDetails.add(detail);
            totalAmount += subtotal;
        }

        ViewCartResponse response = new ViewCartResponse();
        response.setCartId(cart.getCartId());
        response.setItems(itemDetails);
        response.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);

        return response;
    }

    // ========================= REMOVE ITEM FROM CART =========================
    @Override
    @Transactional
    public RemoveCartItemResponse removeItem(int cartItemId) {

        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("Cart item not found");
        }

        cartItemRepository.deleteById(cartItemId);

        RemoveCartItemResponse response = new RemoveCartItemResponse();
        response.setMessage("Item removed from cart");
        return response;
    }
}