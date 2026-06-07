import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import OrdersTable from '../../components/purchaseOrder/list/OrdersTable';
import './ManufacturerOrders.css';

const STATUS_ORDER = {
  PENDING: 1,
  ACCEPTED: 2,
  APPROVED: 2,
  REJECTED: 3,
  CANCELLED: 4,
};


const normaliseOrder = (order) => {
  // Attempt to parse numeric ID from string fields like "PO-36"
  let parsedId = null;
  const strId = order.poNumber || order.orderId || order.purchaseOrderCode;
  if (strId && typeof strId === 'string') {
    const match = strId.match(/\d+/);
    if (match) parsedId = parseInt(match[0], 10);
  }

  return {
    ...order,
    // Numeric PK – used for all API calls
    id: order.id ?? order.purchaseOrderId ?? parsedId ?? null,
    // Display-only PO identifier
    orderId: order.orderId || order.purchaseOrderCode || order.poNumber || `PO-${order.id ?? parsedId}`,
    // Vendor display name
    vendorName:
      order.vendorName ||
      (order.vendor &&
        (order.vendor.name || order.vendor.companyName || order.vendor.vendorName)) ||
      'Unknown Vendor',
    // Dates
    orderDate: order.orderDate || order.createdAt || order.date || null,
    deliveryDate: order.deliveryDate || order.expectedDeliveryDate || null,
    // Money
    totalAmount: order.totalAmount ?? order.total ?? order.grandTotal ?? order.amount ?? 0,
    // Status – always uppercase
    status: (order.status || 'PENDING').toUpperCase(),
    // Items / products
    items: order.items || order.products || order.orderItems || [],
  };
};

const ManufacturerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('ALL');
  /* ── Fetch all orders ── */
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const manufacturerId =
        localStorage.getItem('manufacturerId') || 36;

      const response = await purchaseOrderService.getAllOrders(manufacturerId);
      console.log('Orders API Response:', response);

      // Robust array extraction
      let extractedOrders = [];
      if (Array.isArray(response)) {
        extractedOrders = response;
      } else if (response && typeof response === 'object') {
        const possibleArray =
          response.data ||
          response.orders ||
          response.purchaseOrders ||
          response.content;
        if (Array.isArray(possibleArray)) {
          extractedOrders = possibleArray;
        } else {
          const firstArray = Object.values(response).find((v) =>
            Array.isArray(v)
          );
          if (firstArray) extractedOrders = firstArray;
        }
      }

      const normalised = extractedOrders.map(normaliseOrder);
      console.log('Normalised Orders:', normalised);
      setOrders(normalised);
    } catch (err) {
      console.error('Fetch Orders Error:', err);
      setError(
        err.message || 'Failed to load purchase orders. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── Instant status update (no page refresh) ── */
  const updateOrderStatus = useCallback((numericId, newStatus, deliveryDate = null) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === numericId ? { 
          ...o, 
          status: newStatus.toUpperCase(),
          ...(deliveryDate ? { deliveryDate } : {})
        } : o
      )
    );
  }, []);

  /* ── Derived Filtered Orders ── */
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="m-orders-page">
      {/* Page Header + Filters */}
      <div className="m-orders-page__header">
        <div className="m-orders-page__header-top">
          <div>
            <h1 className="m-orders-page__title">Purchase Orders</h1>
            <p className="m-orders-page__subtitle">
              Review and manage all incoming purchase orders from vendors.
            </p>
          </div>

          <div className="status-filter-group">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].map((filter) => (
              <button
                key={filter}
                className={`status-filter-btn ${statusFilter === filter ? 'status-filter-active' : ''}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="m-orders__skeleton-container">
          <div className="m-orders__skeleton m-orders__skeleton--header" />
          <div className="m-orders__skeleton m-orders__skeleton--row" />
          <div className="m-orders__skeleton m-orders__skeleton--row" />
          <div className="m-orders__skeleton m-orders__skeleton--row" />
        </div>
      ) : error ? (
        <div className="m-orders__error">
          <span className="material-symbols-outlined m-orders__error-icon">
            error_outline
          </span>
          <h3 className="m-orders__error-title">Failed to Load Orders</h3>
          <p className="m-orders__error-msg">{error}</p>
          <button className="m-orders__retry-btn" onClick={fetchOrders}>
            <span className="material-symbols-outlined">refresh</span>
            Retry
          </button>
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          hasFilters={statusFilter !== 'ALL'}
          onStatusUpdate={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default ManufacturerOrders;
