package com.wpoms.admin.controllers;

import com.wpoms.admin.models.payloads.AcceptOrderPayload;
import com.wpoms.admin.models.payloads.RejectOrderPayload;
import com.wpoms.admin.models.response.AcceptOrderResponse;
import com.wpoms.admin.models.response.ManufacturerOrderDetailResponse;
import com.wpoms.admin.models.response.ManufacturerOrderListResponse;
import com.wpoms.admin.models.response.RejectOrderResponse;
import com.wpoms.admin.services.IManufacturerOrderService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manufacturer/orders")
@CrossOrigin
public class ManufacturerOrderController {

    @Autowired
    private IManufacturerOrderService manufacturerOrderService;

    // GET /api/manufacturer/orders
    @GetMapping
    public ResponseEntity<ManufacturerOrderListResponse> getIncomingOrders(@RequestParam int manufacturerId) {
        ManufacturerOrderListResponse response = manufacturerOrderService.getIncomingOrders(manufacturerId);
        return ResponseEntity.ok(response);
    }

    // GET /api/manufacturer/orders/{orderId}
    @GetMapping("/{orderId}")
    public ResponseEntity<ManufacturerOrderDetailResponse> getOrderDetails(@PathVariable int orderId) {
        ManufacturerOrderDetailResponse response = manufacturerOrderService.getOrderDetails(orderId);
        return ResponseEntity.ok(response);
    }

    // POST /api/manufacturer/orders/{orderId}/accept
    @PostMapping("/{orderId}/accept")
    public ResponseEntity<AcceptOrderResponse> acceptOrder(
            @PathVariable int orderId,
            @Valid @RequestBody AcceptOrderPayload payload) {
        AcceptOrderResponse response = manufacturerOrderService.acceptOrder(orderId, payload);
        return ResponseEntity.ok(response);
    }

    // POST /api/manufacturer/orders/{orderId}/reject
    @PostMapping("/{orderId}/reject")
    public ResponseEntity<RejectOrderResponse> rejectOrder(
            @PathVariable int orderId,
            @Valid @RequestBody RejectOrderPayload payload) {
        RejectOrderResponse response = manufacturerOrderService.rejectOrder(orderId, payload);
        return ResponseEntity.ok(response);
    }
}
