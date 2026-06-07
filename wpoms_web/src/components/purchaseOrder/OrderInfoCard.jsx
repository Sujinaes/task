import React from 'react';
import StatusBadge from './StatusBadge';

const OrderInfoCard = ({ order }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="order-info-card">
      {/* ── Header ── */}
      <div className="order-info-card__header">
        <div className="order-info-card__title-group">
          <span className="material-symbols-outlined order-info-card__icon">receipt_long</span>
          <div>
            <h2 className="order-info-card__title">Order {order.orderId}</h2>
            <p className="order-info-card__subtitle">Purchase Order Details</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* ── Body Grid ── */}
      <div className="order-info-card__body">
        <div className="order-info-card__section">
          <h3 className="order-info-card__section-title">
            <span className="material-symbols-outlined">storefront</span>
            Vendor Information
          </h3>
          <div className="order-info-card__grid">
            <div className="order-info-card__field">
              <span className="order-info-card__label">Vendor Name</span>
              <span className="order-info-card__value">{order.vendorName}</span>
            </div>
            <div className="order-info-card__field">
              <span className="order-info-card__label">Address</span>
              <span className="order-info-card__value">{order.vendorAddress}</span>
            </div>
            <div className="order-info-card__field">
              <span className="order-info-card__label">Location</span>
              <span className="order-info-card__value">{order.location}</span>
            </div>
          </div>
        </div>

        <div className="order-info-card__divider" />

        <div className="order-info-card__section">
          <h3 className="order-info-card__section-title">
            <span className="material-symbols-outlined">calendar_month</span>
            Order Information
          </h3>
          <div className="order-info-card__grid">
            <div className="order-info-card__field">
              <span className="order-info-card__label">Order Date</span>
              <span className="order-info-card__value">{formatDate(order.orderDate)}</span>
            </div>
            <div className="order-info-card__field">
              <span className="order-info-card__label">Delivery Date</span>
              <span className="order-info-card__value">
                {order.deliveryDate ? formatDate(order.deliveryDate) : 'Not Set'}
              </span>
            </div>
            <div className="order-info-card__field">
              <span className="order-info-card__label">Total Amount</span>
              <span className="order-info-card__value order-info-card__value--amount">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoCard;
