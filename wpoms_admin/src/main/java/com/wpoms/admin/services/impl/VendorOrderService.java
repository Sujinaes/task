package com.wpoms.admin.services.impl;

import com.wpoms.admin.models.entities.*;
import com.wpoms.admin.models.payloads.PlaceOrderPayload;
import com.wpoms.admin.models.response.*;
import com.wpoms.admin.models.response.VendorOrderDetailResponse.OrderItemDetail;
import com.wpoms.admin.models.response.VendorOrderDetailResponse.ProductInfo;
import com.wpoms.admin.models.response.VendorOrderListResponse.VendorOrderSummary;
import com.wpoms.admin.repositories.*;
import com.wpoms.admin.services.IVendorOrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VendorOrderService implements IVendorOrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ManufacturerMasterRepository manufacturerRepository;

    @Autowired
    private VendorMasterRepository vendorMasterRepository;

    // ========================= PLACE ORDER =========================
    @Override
    @Transactional
    public PlaceOrderResponse placeOrder(int vendorId, PlaceOrderPayload placeOrderPayload) {
        System.out.println(placeOrderPayload.getCartItemIds());

        // 0. Validate vendor name
        VendorMaster vendor = vendorMasterRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!vendor.getVendorName().toLowerCase().trim()
                .equals(placeOrderPayload.getVendorName().toLowerCase().trim())) {
            throw new RuntimeException("Vendor name does not match");
        }

        List<Integer> payloadCartItemIds = placeOrderPayload.getCartItemIds();
        if (payloadCartItemIds == null || payloadCartItemIds.isEmpty()) {
            throw new RuntimeException("Cart item IDs are required");
        }

        // 1. Find vendor's cart
        Cart cart = cartRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new RuntimeException("Cart not found for vendor"));

        // 2. Fetch only the cart items that belong to this vendor's cart AND match the
        // payload IDs
        List<CartItem> matchedCartItems = cartItemRepository
                .findByCartIdAndCartItemIdIn(cart.getCartId(), payloadCartItemIds);

        // Validate: every provided cartItemId must exist in this vendor's cart
        if (matchedCartItems.size() != payloadCartItemIds.size()) {
            throw new RuntimeException(
                    "One or more cart item IDs are invalid or do not belong to this vendor's cart");
        }

        // 3. Ensure all matched items belong to exactly one manufacturer
        Map<Integer, Product> productMap = new HashMap<>();
        Set<Integer> manufacturerIds = new HashSet<>();

        for (CartItem cartItem : matchedCartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));
            productMap.put(cartItem.getProductId(), product);
            manufacturerIds.add(product.getManufacturerId());
        }

        if (manufacturerIds.size() > 1) {
            throw new RuntimeException(
                    "All cart items must belong to the same manufacturer to place an order");
        }

        int manufacturerId = manufacturerIds.iterator().next();

        // 4. Calculate total amount
        double totalAmount = 0;
        for (CartItem item : matchedCartItems) {
            Product product = productMap.get(item.getProductId());
            totalAmount += product.getPrice() * item.getQuantity();
        }

        // 5. Create the order
        Order order = new Order();
        order.setVendorId(vendorId);
        order.setManufacturerId(manufacturerId);
        order.setOrderDate(LocalDate.now());
        order.setStatus("PENDING");
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(placeOrderPayload.getAddress());
        order.setLocation(placeOrderPayload.getLocation());

        Order savedOrder = orderRepository.save(order);

        // Generate PO number
        savedOrder.setPoNumber("PO-" + String.format("%03d", savedOrder.getOrderId()));
        orderRepository.save(savedOrder);

        // 6. Create order items
        for (CartItem cartItem : matchedCartItems) {
            Product product = productMap.get(cartItem.getProductId());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getOrderId());
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice() * cartItem.getQuantity());

            orderItemRepository.save(orderItem);
        }

        // 7. Remove only the ordered cart items from the cart
        for (CartItem cartItem : matchedCartItems) {
            cartItemRepository.deleteById(cartItem.getCartItemId());
        }

        // 8. Build response
        ManufacturerMaster manufacturer = manufacturerRepository.findById(manufacturerId).orElse(null);
        String manufacturerName = manufacturer != null ? manufacturer.getCompanyName() : "Unknown";

        PlaceOrderResponse response = new PlaceOrderResponse();
        response.setMessage("Order placed successfully");
        response.setPoNumber(savedOrder.getPoNumber());
        response.setManufacturer(manufacturerName);
        response.setStatus("PENDING");
        response.setTotalAmount(totalAmount);
        return response;
    }

    // ========================= GET ALL ORDERS =========================
    @Override
    public VendorOrderListResponse getAllOrders(int vendorId) {

        List<Order> orders = orderRepository.findByVendorId(vendorId);

        List<VendorOrderSummary> orderSummaries = orders.stream().map(order -> {
            VendorOrderSummary summary = new VendorOrderSummary();
            summary.setPoNumber(order.getPoNumber());
            summary.setOrderDate(order.getOrderDate());
            summary.setStatus(order.getStatus());
            summary.setDeliveryDate(order.getDeliveryDate());

            // Get manufacturer name
            ManufacturerMaster manufacturer = manufacturerRepository.findById(order.getManufacturerId())
                    .orElse(null);
            summary.setManufacturer(manufacturer != null ? manufacturer.getCompanyName() : "Unknown");
            summary.setTotalAmount(order.getTotalAmount());

            return summary;
        }).collect(Collectors.toList());

        VendorOrderListResponse response = new VendorOrderListResponse();
        response.setOrders(orderSummaries);
        return response;
    }

    // ========================= GET ORDER DETAILS =========================
    @Override
    public VendorOrderDetailResponse getOrderDetails(int orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Get manufacturer name
        ManufacturerMaster manufacturer = manufacturerRepository.findById(order.getManufacturerId())
                .orElse(null);

        // Get order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);

        List<OrderItemDetail> itemDetails = orderItems.stream().map(item -> {
            OrderItemDetail detail = new OrderItemDetail();
            detail.setOrderItemId(item.getOrderItemId());
            detail.setQuantity(item.getQuantity());
            detail.setPrice(item.getPrice());
            detail.setSubtotal(item.getSubtotal());

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

        VendorOrderDetailResponse response = new VendorOrderDetailResponse();
        response.setPoNumber(order.getPoNumber());
        response.setManufacturer(manufacturer != null ? manufacturer.getCompanyName() : "Unknown");
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveryDate(order.getDeliveryDate());
        response.setItems(itemDetails);
        response.setTotalAmount(order.getTotalAmount());
        response.setReason(order.getReason());

        return response;
    }

    // ========================= CANCEL ORDER =========================
    @Override
    public CancelOrderResponse cancelOrder(int orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only PENDING orders can be cancelled");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        CancelOrderResponse response = new CancelOrderResponse();
        response.setMessage("Order cancelled successfully");
        response.setStatus("CANCELLED");

        return response;
    }
}
