import React, { useState, useEffect } from 'react';
import { vendorService } from '../../../../services/vendorService';
import { toast } from 'sonner';
import './OrderSummaryModal.css';

const OrderSummaryModal = ({ orderId, onClose, onCancelOrder }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order details 
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const data = await vendorService.getOrderDetails(orderId);

        // Normalize the data to handle nested product structure
        const normalizedOrder = {
          poNumber: data.poNumber,
          manufacturerName: data.manufacturer || data.manufacturerName,
          status: data.status,
          orderDate: data.orderDate,
          deliveryDate: data.deliveryDate || data.expectedDeliveryDate,
          rejectionReason: data.rejectionReason || data.reason,
          totalAmount: data.totalAmount,
          vendorName: data.vendorName,
          vendorAddress: data.address || data.vendorAddress,
          vendorLocation: data.location || data.vendorLocation,
          items: (data.items || []).map(item => ({
            productName: item.product?.productName || item.productName || '—',
            category: item.product?.category || item.category || '—',
            price: item.price || 0,
            quantity: item.quantity || 1,
            subtotal: item.subtotal || (item.price * item.quantity)
          }))
        };

        setOrder(normalizedOrder);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        toast.error(err.message || 'Failed to load order details');
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, onClose]);

  if (isLoading) {
    return (
      <div className="order-summary-modal-overlay" onClick={onClose}>
        <div className="order-summary-modal" onClick={(e) => e.stopPropagation()}>
          <div className="order-details-loading">
            <span className="material-symbols-outlined loading-spinner">progress_activity</span>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  // Extract fields with fallbacks 
  const id = order.poNumber;
  const status = order.status || 'Pending';
  const orderDate = order.orderDate;
  const totalAmount = order.totalAmount || 0;
  const items = order.items || [];
  const manufacturerName = order.manufacturerName || '';
  const vendorName = order.vendorName || '';
  const vendorAddress = order.vendorAddress || '';
  const vendorLocation = order.vendorLocation || '';
  const deliveryDate = order.deliveryDate;
  const rejectionReason = order.rejectionReason;

  const isPending = status?.toUpperCase() === 'PENDING';

  return (
    <div className="order-summary-modal-overlay" onClick={onClose}>
      <div className="order-summary-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="order-summary-header">
          <div className="order-summary-title-row">
            <h2 className="order-summary-title">
              <span className="material-symbols-outlined title-icon">receipt_long</span>
              Order {id}
            </h2>
            <button
              className={`status-badge status-${status.toLowerCase()}`}
              onClick={() => {
                if (isPending && onCancelOrder) {
                  onCancelOrder(order);
                }
              }}
              style={{ cursor: isPending ? 'pointer' : 'default' }}
              title={isPending ? 'Click to cancel this order' : ''}
            >
              {status}
            </button>
          </div>
          {orderDate && (
            <p className="order-summary-date">
              <span className="material-symbols-outlined">calendar_today</span>
              {new Date(orderDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <button className="btn-modal-close-icon" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="order-summary-body">
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
            {status?.toUpperCase() === 'ACCEPTED' && (
              <div className="order-info-card">
                <div className="info-card-icon" style={{color: '#2e7d32', backgroundColor: '#e8f5e9'}}>
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <span className="info-card-label" style={{color: '#2e7d32'}}>Delivery Date</span>
                  <span className="info-card-value">
                    {deliveryDate 
                      ? new Date(deliveryDate).toLocaleDateString('en-IN') 
                      : '—'}
                  </span>
                </div>
              </div>
            )}
            {status?.toUpperCase() === 'REJECTED' && (
              <div className="order-info-card">
                <div className="info-card-icon" style={{color: '#d32f2f', backgroundColor: '#ffebee'}}>
                  <span className="material-symbols-outlined">error</span>
                </div>
                <div>
                  <span className="info-card-label" style={{color: '#d32f2f'}}>Rejection Reason</span>
                  <span className="info-card-value">{rejectionReason || '—'}</span>
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
                      <th>#</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="row-number">{idx + 1}</td>
                        <td className="product-name-cell">{item.productName}</td>
                        <td>
                          <span className="item-category-tag">{item.category}</span>
                        </td>
                        <td>₹{item.price.toLocaleString()}</td>
                        <td>{item.quantity}</td>
                        <td className="subtotal-cell">₹{item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="order-total-section">
            <span className="order-total-label">Order Total</span>
            <span className="order-total-value">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;