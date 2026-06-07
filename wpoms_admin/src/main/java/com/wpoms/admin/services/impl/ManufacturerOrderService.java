package com.wpoms.admin.services.impl;

import com.wpoms.admin.models.entities.*;
import com.wpoms.admin.models.payloads.AcceptOrderPayload;
import com.wpoms.admin.models.payloads.RejectOrderPayload;
import com.wpoms.admin.models.response.*;
import com.wpoms.admin.models.response.ManufacturerOrderDetailResponse.ManufacturerOrderItemDetail;
import com.wpoms.admin.models.response.ManufacturerOrderDetailResponse.ProductInfo;
import com.wpoms.admin.models.response.ManufacturerOrderListResponse.ManufacturerOrderSummary;
import com.wpoms.admin.repositories.*;
import com.wpoms.admin.services.IManufacturerOrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManufacturerOrderService implements IManufacturerOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VendorMasterRepository vendorRepository;

    // ========================= VIEW INCOMING ORDERS =========================
    @Override
    public ManufacturerOrderListResponse getIncomingOrders(int manufacturerId) {

        List<Order> orders = orderRepository.findByManufacturerId(manufacturerId);

        List<ManufacturerOrderSummary> orderSummaries = orders.stream().map(order -> {
            ManufacturerOrderSummary summary = new ManufacturerOrderSummary();
            summary.setPoNumber(order.getPoNumber());
            summary.setOrderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null);
            summary.setStatus(order.getStatus());
            summary.setTotalAmount(order.getTotalAmount());
            summary.setDeliveryDate(order.getDeliveryDate());

            // Get vendor name
            VendorMaster vendor = vendorRepository.findByVendorId(order.getVendorId())
                    .orElse(null);
            summary.setVendorName(vendor != null ? vendor.getVendorName() : "Unknown");

            return summary;
        }).collect(Collectors.toList());

        ManufacturerOrderListResponse response = new ManufacturerOrderListResponse();
        response.setOrders(orderSummaries);
        return response;
    }

    // ========================= VIEW ORDER DETAILS =========================
    @Override
    public ManufacturerOrderDetailResponse getOrderDetails(int orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Get vendor name
        VendorMaster vendor = vendorRepository.findByVendorId(order.getVendorId())
                .orElse(null);

        // Get order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);

        List<ManufacturerOrderItemDetail> itemDetails = orderItems.stream().map(item -> {
            ManufacturerOrderItemDetail detail = new ManufacturerOrderItemDetail();
            detail.setOrderItemId(item.getOrderItemId());
            detail.setQuantity(item.getQuantity());

            // Get product info
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product != null) {
                ProductInfo productInfo = new ProductInfo();
                productInfo.setProductId(product.getProductId());
                productInfo.setProductName(product.getProductName());
                productInfo.setCategory(product.getCategory());
                productInfo.setDescription(product.getDescription());
                productInfo.setWarrantyType(product.getWarrantyType());
                productInfo.setManufacturerId(product.getManufacturerId());
                productInfo.setPrice(product.getPrice());
                detail.setProduct(productInfo);
            }

            return detail;
        }).collect(Collectors.toList());

        ManufacturerOrderDetailResponse response = new ManufacturerOrderDetailResponse();
        response.setPoNumber(order.getPoNumber());
        response.setVendorName(vendor != null ? vendor.getVendorName() : "Unknown");
        response.setStatus(order.getStatus());
        response.setItems(itemDetails);
        response.setTotalAmount(order.getTotalAmount());
        response.setReason(order.getReason());

        return response;
    }

    // ========================= ACCEPT ORDER =========================
    @Override
    public AcceptOrderResponse acceptOrder(int orderId, AcceptOrderPayload payload) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only PENDING orders can be accepted");
        }

        order.setStatus("ACCEPTED");
        order.setDeliveryDate(payload.getDeliveryDate());
        orderRepository.save(order);

        AcceptOrderResponse response = new AcceptOrderResponse();
        response.setMessage("Order accepted");
        response.setStatus("ACCEPTED");
        response.setDeliveryDate(payload.getDeliveryDate());

        return response;
    }

    // ========================= REJECT ORDER =========================
    @Override
    public RejectOrderResponse rejectOrder(int orderId, RejectOrderPayload payload) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only PENDING orders can be rejected");
        }

        order.setStatus("REJECTED");
        order.setReason(payload.getReason());
        orderRepository.save(order);

        RejectOrderResponse response = new RejectOrderResponse();
        response.setMessage("Order rejected");
        response.setStatus("REJECTED");
        response.setReason(payload.getReason());

        return response;
    }
}
