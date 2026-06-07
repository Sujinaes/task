import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelOrderModal from './components/orders/CancelOrderModal';
import OrderSummaryModal from './components/orders/OrderSummaryModal';
import { vendorService } from '../../services/vendorService';
import { toast } from 'sonner';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const extractNumericId = (orderId) => {
    if (!orderId) return 0;
    if (typeof orderId === 'string' && orderId.includes('-')) {
      return parseInt(orderId.split('-')[1], 10) || 0;
    }
    return parseInt(orderId, 10) || 0;
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await vendorService.getOrders();

      let ordersArray = Array.isArray(data) ? data : 
                        data?.orders || data?.data || data?.content || 
                        (data?.orderId || data?.id ? [data] : []);

      console.log('Orders array before detail fetch:', ordersArray.length, ordersArray);

      if (ordersArray.length === 0) {
        console.warn('No orders found after extraction');
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const fullOrdersArray = await Promise.all(
        ordersArray.map(async (order) => {
          try {
            const extractedId = order.poNumber 
              ? parseInt(order.poNumber.split('-')[1], 10) 
              : (order.orderId || order.id);
            
            console.log('Processing order with extracted ID:', extractedId, order);
            
            if (extractedId) {
              const details = await vendorService.getOrderDetails(extractedId);
              console.log('Fetched details for order', extractedId, details);
              return { ...order, ...details };
            }
          } catch (e) {
            console.error('Failed to fetch details for order', order, e.message);
          }
          return order;
        })
      );

      const sortedOrders = fullOrdersArray.sort((a, b) => {
        const idA = extractNumericId(a.poNumber || a.orderId || a.id);
        const idB = extractNumericId(b.poNumber || b.orderId || b.id);
        return idB - idA;
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const handleOrderPlaced = () => fetchOrders();
    window.addEventListener('orderPlaced', handleOrderPlaced);
    return () => window.removeEventListener('orderPlaced', handleOrderPlaced);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const orderStatus = (order.status || 'PENDING').toLowerCase();
    return statusFilter === 'all' ? true : orderStatus === statusFilter;
  });

  const handleCancelOrder = async (orderId) => {
  try {
    setIsCancelling(true);
    
    // Extract numeric ID from "PO-106" format
    let numericId = orderId;
    if (typeof numericId === 'string' && numericId.includes('-')) {
      numericId = parseInt(numericId.split('-')[1], 10);
    }
    
    await vendorService.cancelOrder(numericId);
    toast.success('Order cancelled successfully');
    setCancelTarget(null);
    setSelectedOrder(null);
    fetchOrders();
  } catch (err) {
    toast.error(err.message || 'Failed to cancel order');
  } finally {
    setIsCancelling(false);
  }
};

  if (isLoading && orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-loading">
          <span className="material-symbols-outlined loading-spinner">progress_activity</span>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-header">
          <h2 className="my-orders-title">
            <span className="material-symbols-outlined title-icon">receipt_long</span>
            My Orders
          </h2>
          <p className="my-orders-subtitle">Track and manage your purchase orders.</p>
        </div>
        <div className="my-orders-empty">
          <span className="material-symbols-outlined">inbox</span>
          <p>No orders yet. Start by adding products to your cart and placing an order!</p>
          <button className="btn-browse" onClick={() => navigate('/vendor/product-catalog')}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-header">
        <div className="my-orders-header-top">
          <div>
            <h2 className="my-orders-title">
              <span className="material-symbols-outlined title-icon">receipt_long</span>
              My Orders
            </h2>
            <p className="my-orders-subtitle">Track and manage your purchase orders.</p>
          </div>

          <div className="status-filter-group">
            {['all', 'pending', 'accepted', 'rejected', 'cancelled'].map((filter) => (
              <button
                key={filter}
                className={`status-filter-btn ${statusFilter === filter ? 'status-filter-active' : ''}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="my-orders-empty">
            <span className="material-symbols-outlined">filter_alt_off</span>
            <p>No {statusFilter !== 'all' ? statusFilter : ''} orders found.</p>
            {statusFilter !== 'all' && (
              <button className="btn-browse" onClick={() => setStatusFilter('all')}>
                View All Orders
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const orderId = order.poNumber || order.orderId || order.purchaseOrderId || order.id;
            const orderStatus = (order.status || 'PENDING').charAt(0).toUpperCase() + 
                                (order.status || 'PENDING').slice(1).toLowerCase();
            const orderDate = order.orderDate || order.createdAt || order.placedAt;
            const orderTotal = order.totalAmount || order.totalPrice || order.total || 0;
            const manufacturerName = order.manufacturerName || order.manufacturer || '';
            const deliveryDate = order.deliveryDate || order.expectedDeliveryDate;
            const rejectionReason = order.rejectionReason || order.reason;

            return (
              <div key={orderId} className="order-card" onClick={() => setSelectedOrder(order)}>
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-id">{orderId}</span>
                    {orderDate && (
                      <span className="order-date">
                        <span className="material-symbols-outlined">calendar_today</span>
                        {new Date(orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <div className="order-header-right">
                    <button
                      className={`status-badge status-${orderStatus.toLowerCase()}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (orderStatus.toLowerCase() === 'pending') setCancelTarget(order);
                      }}
                      title={orderStatus.toLowerCase() === 'pending' ? 'Click to cancel' : ''}
                    >
                      {orderStatus}
                    </button>
                  </div>
                </div>

                <div className="order-details-row">
                  {manufacturerName && (
                    <div className="order-detail-block">
                      <span className="detail-block-label">
                        <span className="material-symbols-outlined">factory</span>
                        Manufacturer
                      </span>
                      <span className="detail-block-value">{manufacturerName}</span>
                    </div>
                  )}
                  {orderStatus.toUpperCase() === 'ACCEPTED' && (
                    <div className="order-detail-block">
                      <span className="detail-block-label" style={{color: '#2e7d32'}}>
                        <span className="material-symbols-outlined">local_shipping</span>
                        Delivery Date
                      </span>
                      <span className="detail-block-value" style={{color: '#2e7d32', fontWeight: 600}}>
                        {deliveryDate ? new Date(deliveryDate).toLocaleDateString('en-IN') : '—'}
                      </span>
                    </div>
                  )}
                  {orderStatus.toUpperCase() === 'REJECTED' && (
                    <div className="order-detail-block">
                      <span className="detail-block-label" style={{color: '#d32f2f'}}>
                        <span className="material-symbols-outlined">error</span>
                        Rejection Reason
                      </span>
                      <span className="detail-block-value" style={{color: '#d32f2f', fontWeight: 600}}>
                        {rejectionReason || '—'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <span className="order-total-label">Order Total</span>
                  <span className="order-total-value">₹{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cancelTarget && (
        <CancelOrderModal
          order={cancelTarget}
          onConfirm={() => handleCancelOrder(cancelTarget.poNumber || cancelTarget.orderId || cancelTarget.id)}
          onClose={() => setCancelTarget(null)}
          isLoading={isCancelling}
        />
      )}

      {selectedOrder && (
        <OrderSummaryModal
          orderId={selectedOrder.poNumber ? parseInt(selectedOrder.poNumber.split('-')[1], 10) : (selectedOrder.orderId || selectedOrder.id)}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={(order) => setCancelTarget(order)}
        />
      )}
    </div>
  );
};

export default MyOrders;