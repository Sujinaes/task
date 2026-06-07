import React, { useState } from 'react';
import AcceptSection from './AcceptSection';
import RejectSection from './RejectSection';
import StatusBadge from './StatusBadge';
import './OrderActionPanel.css';

const OrderActionPanel = ({ order, onAccept, onReject, isSubmitting }) => {
  const [showAcceptSection, setShowAcceptSection] = useState(false);
  const [showRejectSection, setShowRejectSection] = useState(false);

  const isPending = order?.status?.toUpperCase() === 'PENDING';

  const handleAcceptClick = () => {
    setShowRejectSection(false);           // Close reject if open
    setShowAcceptSection((prev) => !prev); // Toggle accept
  };

  const handleRejectClick = () => {
    setShowAcceptSection(false);           // Close accept if open
    setShowRejectSection((prev) => !prev); // Toggle reject
  };

  const handleAcceptConfirm = async (deliveryDate) => {
    await onAccept(deliveryDate);
    setShowAcceptSection(false);
  };

  const handleRejectConfirm = async (reason, remarks) => {
    await onReject(reason, remarks);
    setShowRejectSection(false);
  };

  const handleCancel = () => {
    setShowAcceptSection(false);
    setShowRejectSection(false);
  };

  /* ── Non-PENDING status ── */
  if (!isPending) {
    return (
      <div className="oa-panel oa-panel--sticky">
        <div className="oa-panel__status-resolved">
          <StatusBadge status={order.status} />
          <span className="oa-panel__status-text">
            This order has been <strong>{order.status?.toLowerCase()}</strong>.
          </span>
        </div>
      </div>
    );
  }

  /* ── PENDING status ── */
  return (
    <div className="oa-panel oa-panel--sticky" id="order-action-panel">
      {/* ── Action Buttons ── */}
      <div className="oa-panel__buttons">
        <button
          className={`oa-panel__btn oa-panel__btn--reject ${showRejectSection ? 'oa-panel__btn--active' : ''}`}
          onClick={handleRejectClick}
          disabled={isSubmitting}
          id="reject-order-btn"
        >
          <span className="material-symbols-outlined">close</span>
          Reject Order
        </button>
        <button
          className={`oa-panel__btn oa-panel__btn--accept ${showAcceptSection ? 'oa-panel__btn--active' : ''}`}
          onClick={handleAcceptClick}
          disabled={isSubmitting}
          id="accept-order-btn"
        >
          <span className="material-symbols-outlined">check</span>
          Accept Order
        </button>
      </div>

      {/* ── Expandable Sections (always in DOM for CSS transitions) ── */}
      <AcceptSection
        orderId={order.orderId}
        isOpen={showAcceptSection}
        onConfirm={handleAcceptConfirm}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      <RejectSection
        orderId={order.orderId}
        isOpen={showRejectSection}
        onConfirm={handleRejectConfirm}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default OrderActionPanel;
