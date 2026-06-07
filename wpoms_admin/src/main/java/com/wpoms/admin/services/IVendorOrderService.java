package com.wpoms.admin.services;

import com.wpoms.admin.models.payloads.PlaceOrderPayload;
import com.wpoms.admin.models.response.CancelOrderResponse;
import com.wpoms.admin.models.response.PlaceOrderResponse;
import com.wpoms.admin.models.response.VendorOrderDetailResponse;
import com.wpoms.admin.models.response.VendorOrderListResponse;

public interface IVendorOrderService {

    PlaceOrderResponse placeOrder(int vendorId , PlaceOrderPayload placeOrderPayload);

    VendorOrderListResponse getAllOrders(int vendorId);

    VendorOrderDetailResponse getOrderDetails(int orderId);

    CancelOrderResponse cancelOrder(int orderId);
}
