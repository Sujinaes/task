import React from 'react';

const CancelOrderModal = ({ order, onConfirm, onClose, isLoading }) => {
  if (!order) return null;

  const orderId = order.poNumber ? parseInt(order.poNumber.split('-')[1], 10) : (order.orderId || order.purchaseOrderId || order.id);
  const orderDate = order.orderDate || order.createdAt || order.placedAt;

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cancel-modal-header">
          <span className="material-symbols-outlined cancel-modal-icon">warning</span>
          <h3>Cancel Order</h3>
        </div>

        {/* Body */}
        <div className="cancel-modal-body">
          <p>Are you sure you want to cancel this order?</p>
          <div className="cancel-modal-order-info">
            <span className="cancel-order-id">Order #{orderId}</span>
            {orderDate && (
              <span className="cancel-order-date">
                {new Date(orderDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
          <p className="cancel-modal-warning">This action cannot be undone.</p>
        </div>

        {/* Actions */}
        <div className="cancel-modal-actions">
          <button className="btn-modal-close" onClick={onClose} disabled={isLoading}>
            Close
          </button>
          <button
            className="btn-modal-cancel-order"
            onClick={() => onConfirm(orderId)}
            disabled={isLoading}
          >
            <span className="material-symbols-outlined">
              {isLoading ? 'progress_activity' : 'cancel'}
            </span>
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
