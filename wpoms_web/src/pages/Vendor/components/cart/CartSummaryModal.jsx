import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CancelOrderModal from '../orders/CancelOrderModal';
import { vendorService } from '../../../../services/vendorService';
import { toast } from 'sonner';
import './CartSummaryModal.css';

const CartSummaryModal = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const data = await vendorService.getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        toast.error(err.message || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async (numericOrderId) => {
  console.log('1. Received in handleCancelOrder:', numericOrderId, 'Type:', typeof numericOrderId);
  
  try {
    setIsCancelling(true);
    
    console.log('2. Calling vendorService.cancelOrder with:', numericOrderId);
    await vendorService.cancelOrder(numericOrderId);
    
    toast.success('Order cancelled successfully');
    setCancelTarget(null);
    
    const updated = await vendorService.getOrderDetails(numericOrderId);
    setOrder(updated);
  } catch (err) {
    console.error('3. Error:', err);
    toast.error(err.message || 'Failed to cancel order');
  } finally {
    setIsCancelling(false);
  }
};

  if (isLoading) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">
          <span className="material-symbols-outlined loading-spinner">progress_activity</span>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-details-empty">
          <span className="material-symbols-outlined">error_outline</span>
          <p>Order not found.</p>
          <button className="btn-back" onClick={() => navigate('/vendor/my-orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const id = order.poNumber || order.orderId || order.id;
  const status = order.status || 'Pending';
  const orderDate = order.orderDate || order.createdAt;
  const totalAmount = order.totalAmount || order.totalPrice || 0;
  const items = order.items || order.orderItems || [];
  const manufacturerName = order.manufacturerName || '';
  const vendorName = order.vendorName || '';
  const vendorAddress = order.vendorAddress || order.address || '';
  const vendorLocation = order.vendorLocation || order.location || '';

  const isPending = status?.toLowerCase() === 'pending';

  return (
    <div className="order-details-page">
      {/* Header */}
      <div className="order-details-header">
        <button className="btn-back-nav" onClick={() => navigate('/vendor/my-orders')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Orders
        </button>

        <div className="order-details-header-main">
          <div className="order-details-title-row">
            <h2 className="order-details-title">
              <span className="material-symbols-outlined title-icon">receipt_long</span>
              Order #{id}
            </h2>
            <button
              className={`status-badge status-${status?.toLowerCase() || 'pending'}`}
              onClick={() => { if (isPending) setCancelTarget(order); }}
              style={{ cursor: isPending ? 'pointer' : 'default' }}
              title={isPending ? 'Click to cancel this order' : ''}
            >
              {status}
            </button>
          </div>
          {orderDate && (
            <p className="order-details-date">
              <span className="material-symbols-outlined">calendar_today</span>
              {new Date(orderDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="order-info-grid">
        {manufacturerName && (
          <div className="order-info-card">
            <div className="info-card-icon">
              <span className="material-symbols-outlined">factory</span>
            </div>
            <div>
              <span className="info-card-label">Manufacturer</span>
              <span className="info-card-value">{manufacturerName}</span>
            </div>
          </div>
        )}
        {vendorName && (
          <div className="order-info-card">
            <div className="info-card-icon">
              <span className="material-symbols-outlined">store</span>
            </div>
            <div>
              <span className="info-card-label">Vendor</span>
              <span className="info-card-value">{vendorName}</span>
            </div>
          </div>
        )}
        {vendorAddress && (
          <div className="order-info-card">
            <div className="info-card-icon">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <span className="info-card-label">Address</span>
              <span className="info-card-value">{vendorAddress}</span>
            </div>
          </div>
        )}
        {vendorLocation && (
          <div className="order-info-card">
            <div className="info-card-icon">
              <span className="material-symbols-outlined">pin_drop</span>
            </div>
            <div>
              <span className="info-card-label">Location</span>
              <span className="info-card-value">{vendorLocation}</span>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      {items.length > 0 && (
        <div className="order-products-section">
          <h3 className="section-title">
            <span className="material-symbols-outlined">inventory_2</span>
            Ordered Products
          </h3>
          <div className="order-products-table-wrapper">
            <table className="order-products-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const itemName = item.productName || item.name || '—';
                  const itemPrice = item.price || 0;
                  const itemQty = item.quantity || 1;
                  const itemCategory = item.category || item.product?.category || '—';
                  return (
                    <tr key={idx}>
                      <td className="row-number">{idx + 1}</td>
                      <td className="product-name-cell">{itemName}</td>
                      <td>
                        <span className="item-category-tag">{itemCategory}</span>
                      </td>
                      <td className="price-cell">₹{itemPrice.toLocaleString()}</td>
                      <td className="qty-cell">{itemQty}</td>
                      <td className="subtotal-cell">₹{(itemPrice * itemQty).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Total Section */}
      <div className="order-total-section">
        <div className="order-total-left">
          <span className="order-total-label">Total Amount</span>
          <p className="order-total-note">Including all taxes</p>
        </div>
        <div className="order-total-right">
          <span className="order-total-value">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Cancel Button */}
      {isPending && (
        <div className="order-actions">
          <button className="btn-cancel-order" onClick={() => setCancelTarget(order)}>
            <span className="material-symbols-outlined">cancel</span>
            Cancel Order
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelOrderModal
          order={cancelTarget}
          onConfirm={handleCancelOrder}
          onClose={() => setCancelTarget(null)}
          isLoading={isCancelling}
        />
      )}
    </div>
  );
};

export default CartSummaryModal;