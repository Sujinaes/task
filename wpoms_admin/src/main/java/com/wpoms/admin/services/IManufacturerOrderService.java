package com.wpoms.admin.services;

import com.wpoms.admin.models.payloads.AcceptOrderPayload;
import com.wpoms.admin.models.payloads.RejectOrderPayload;
import com.wpoms.admin.models.response.AcceptOrderResponse;
import com.wpoms.admin.models.response.ManufacturerOrderDetailResponse;
import com.wpoms.admin.models.response.ManufacturerOrderListResponse;
import com.wpoms.admin.models.response.RejectOrderResponse;

public interface IManufacturerOrderService {

    ManufacturerOrderListResponse getIncomingOrders(int manufacturerId);

    ManufacturerOrderDetailResponse getOrderDetails(int orderId);

    AcceptOrderResponse acceptOrder(int orderId, AcceptOrderPayload payload);

    RejectOrderResponse rejectOrder(int orderId, RejectOrderPayload payload);
}
