package com.wpoms.admin.controllers;

import com.wpoms.admin.models.payloads.AddToCartPayload;
import com.wpoms.admin.models.response.AddToCartResponse;
import com.wpoms.admin.models.response.RemoveCartItemResponse;
import com.wpoms.admin.models.response.ViewCartResponse;
import com.wpoms.admin.services.IVendorCartService;


import jakarta.validation.Valid;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor/cart")
@CrossOrigin
public class VendorCartController {


    @Autowired
    private IVendorCartService vendorCartService;


    // POST /api/vendor/cart/add
    @PostMapping("/add")
    public ResponseEntity<AddToCartResponse> addToCart(
            @RequestParam int vendorId,
            @Valid @RequestBody AddToCartPayload payload) {
        AddToCartResponse response = vendorCartService.addToCart(vendorId, payload);
        return ResponseEntity.ok(response);
    }

    // GET /api/vendor/cart
    @GetMapping
    public ResponseEntity<ViewCartResponse> viewCart(@RequestParam int vendorId) {
        ViewCartResponse response = vendorCartService.viewCart(vendorId);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/vendor/cart/remove/{cartItemId}
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<RemoveCartItemResponse> removeItem(@PathVariable int cartItemId) {
        RemoveCartItemResponse response = vendorCartService.removeItem(cartItemId);
        return ResponseEntity.ok(response);
    }
}
