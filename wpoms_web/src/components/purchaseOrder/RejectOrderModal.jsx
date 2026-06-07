import React, { useState } from 'react';

const REJECTION_REASONS = [
  'Out of Stock',
  'Cannot Deliver',
  'Invalid Request',
  'Other',
];

const RejectOrderModal = ({ orderId, onConfirm, onClose, isSubmitting }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason) {
      setError('Please select a rejection reason.');
      return;
    }

    setError('');
    onConfirm(reason);
  };

  return (
    <div className="po-modal-overlay" onClick={onClose}>
      <div className="po-modal po-modal--reject" onClick={(e) => e.stopPropagation()}>
        {/* Icon Circle */}
        <div className="po-modal__icon-circle po-modal__icon-circle--reject">
          <span className="material-symbols-outlined">cancel</span>
        </div>

        <h2 className="po-modal__title">Reject Order</h2>
        <p className="po-modal__description">
          You are about to reject order <strong>{orderId}</strong>. This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit} className="po-modal__form">
          <label className="po-modal__field">
            <span className="po-modal__label">
              <span className="material-symbols-outlined">report</span>
              Rejection Reason
            </span>
            <select
              className={`po-modal__input po-modal__select ${error ? 'po-modal__input--error' : ''}`}
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              disabled={isSubmitting}
            >
              <option value="">— Select a reason —</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
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
              className="po-modal__btn po-modal__btn--reject"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="po-modal__spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">close</span>
                  Confirm Reject
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectOrderModal;
