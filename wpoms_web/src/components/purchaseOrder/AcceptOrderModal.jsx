import React, { useState } from 'react';

const AcceptOrderModal = ({ orderId, onConfirm, onClose, isSubmitting }) => {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [error, setError] = useState('');

  // Tomorrow as the minimum selectable date
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deliveryDate) {
      setError('Please select a delivery date.');
      return;
    }

    const selected = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      setError('Delivery date must be a future date.');
      return;
    }

    setError('');
    onConfirm(deliveryDate);
  };

  return (
    <div className="po-modal-overlay" onClick={onClose}>
      <div className="po-modal po-modal--accept" onClick={(e) => e.stopPropagation()}>
        {/* Icon Circle */}
        <div className="po-modal__icon-circle po-modal__icon-circle--accept">
          <span className="material-symbols-outlined">check_circle</span>
        </div>

        <h2 className="po-modal__title">Accept Order</h2>
        <p className="po-modal__description">
          You are about to accept order <strong>{orderId}</strong>. Please select a delivery date to proceed.
        </p>

        <form onSubmit={handleSubmit} className="po-modal__form">
          <label className="po-modal__field">
            <span className="po-modal__label">
              <span className="material-symbols-outlined">calendar_month</span>
              Delivery Date
            </span>
            <input
              type="date"
              className={`po-modal__input ${error ? 'po-modal__input--error' : ''}`}
              value={deliveryDate}
              onChange={(e) => { setDeliveryDate(e.target.value); setError(''); }}
              min={getMinDate()}
              disabled={isSubmitting}
            />
            {error && <span className="po-modal__error">{error}</span>}
          </label>

          <div className="po-modal__actions">
            <button
              type="button"
              className="po-modal__btn po-modal__btn--cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="po-modal__btn po-modal__btn--accept"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="po-modal__spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">check</span>
                  Confirm Accept
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptOrderModal;
