package com.wpoms.admin.controllers;

import com.wpoms.admin.models.payloads.PlaceOrderPayload;
import com.wpoms.admin.models.response.CancelOrderResponse;
import com.wpoms.admin.models.response.PlaceOrderResponse;
import com.wpoms.admin.models.response.VendorOrderDetailResponse;
import com.wpoms.admin.models.response.VendorOrderListResponse;
import com.wpoms.admin.services.IVendorOrderService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor/orders")
@CrossOrigin
public class VendorOrderController {

    @Autowired
    private IVendorOrderService vendorOrderService;

    // POST /api/vendor/orders/place
    @PostMapping("/place")
    public ResponseEntity<PlaceOrderResponse> placeOrder(@RequestParam int vendorId ,@Valid @RequestBody PlaceOrderPayload placeOrderPayload) {

        PlaceOrderResponse response = vendorOrderService.placeOrder(vendorId, placeOrderPayload);
        return ResponseEntity.ok(response);
    }

    // GET /api/vendor/orders
    @GetMapping
    public ResponseEntity<VendorOrderListResponse> getAllOrders(@RequestParam int vendorId) {
        VendorOrderListResponse response = vendorOrderService.getAllOrders(vendorId);
        return ResponseEntity.ok(response);
    }

    // GET /api/vendor/orders/{orderId}
    @GetMapping("/{orderId}")
    public ResponseEntity<VendorOrderDetailResponse> getOrderDetails(@PathVariable int orderId) {
        VendorOrderDetailResponse response = vendorOrderService.getOrderDetails(orderId);
        return ResponseEntity.ok(response);
    }

    // PUT /api/vendor/orders/cancel/{orderId}
    @PatchMapping("/cancel/{orderId}")
    public ResponseEntity<CancelOrderResponse> cancelOrder(@PathVariable int orderId) {
        CancelOrderResponse response = vendorOrderService.cancelOrder(orderId);
        return ResponseEntity.ok(response);
    }
}
